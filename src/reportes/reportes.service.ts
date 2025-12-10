import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Reporte } from './entities/reporte.entity';
import { In, Between, Repository } from 'typeorm';
import { TipoReporte } from './entities/tipo-reporte.entity';
import { FiltroReporteDto } from './dto/find-reporte.dto';
import { Estado } from './entities/estado.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportesService {
  private drive;
  private oauth2Client;

  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(TipoReporte)
    private readonly tipoReporte: Repository<TipoReporte>,
    @InjectRepository(Estado)
    private readonly estadoReporte: Repository<Estado>,
  ) {

    // Aquí usas el refresh token generado manualmente
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID2,
      process.env.GOOGLE_CLIENT_SECRET2,
      process.env.GOOGLE_REDIRECT_URI2
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async uploadFile(file: Express.Multer.File, userId: number) {
    const folderId = '11XzGhhpc62I_lVKfaU3kDHAfECZdt4ox';

    const random = Math.random().toString(36).substring(2, 10);
    const extension = file.originalname.split('.').pop();
    const fileName = `${userId}-${random}.${extension}`;

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: file.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id',
    });

    // Permiso público
    await this.drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    // URLs
    const result = await this.drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink,webContentLink',
    });

    return {
      url: result.data.webContentLink,
      viewUrl: result.data.webViewLink,
      fileName,
    };
  }

  async create(dto, idUser: number, file?: Express.Multer.File) {
    let imagenUrl;

    if (file) {
      const upload = await this.uploadFile(file, idUser);
      imagenUrl = upload.url;
    }

    const reporte = this.reporteRepo.create({
      concesionaria: { id_Concesionaria: dto.concesionaria },
      descripcion: dto.descripcion,
      estado: { id_Estado: 1 },
      fecha_reporte: new Date(),
      tipoReporte: { id_tipoReporte: dto.tipoReporte },
      usuario: { id_usuario: idUser },
      imagen: imagenUrl,
    });

    return await this.reporteRepo.save(reporte);
  }

  async findAllTipos() {
    return await this.tipoReporte.find();
  }

  async findAllEstados() {
    return await this.estadoReporte.find();
  }

  async findByUser(idUser: number) {
    let reporte = await this.reporteRepo.find({ where: { usuario: { id_usuario: idUser } }, relations: ['concesionaria', 'estado', 'tipoReporte'] })
    if (!reporte) {
      throw new Error('No se encontraron reportes para este usuario');
    }
    return reporte;

  }

  async reportesIncidencia() {
    try {
      let incidencia = await this.reporteRepo
        .createQueryBuilder('reporte')
        .innerJoin('reporte.concesionaria', 'c')
        .innerJoin('reporte.tipoReporte', 'tr')
        .select('c.numAutorizado', 'AUT')
        .addSelect('tr.tipoReporte', 'tipo de reporte')
        .addSelect('COUNT * AS TOTAL')
        .groupBy('c.numAutorizado')
        .addGroupBy('tr.tipoReporte')
        .orderBy('DESC')
        .getMany();

      return incidencia;
    } catch (err) {
      throw new Error('Error al generar el reporte de incidencias');
    }

  }
  async reportesIncidenciaFecha(fechaI: Date, fechaF: Date, estado?: string) {
    try {
      let incidencia = await this.reporteRepo
        .createQueryBuilder('reporte')
        .innerJoin('reporte.concesionaria', 'c')
        .innerJoin('reporte.tipoReporte', 'tr')
        .innerJoin('reporte.estado', 'e')
        .select('c.numAutorizado', 'AUT')
        .addSelect('tr.tipoReporte', 'tipo_de_reporte')
        .addSelect('COUNT(*) AS TOTAL')
        .where('reporte.fecha_reporte BETWEEN :inicio AND :fin', {
          inicio: fechaI,
          fin: fechaF
        })
        .andWhere(estado ? 'e.estado = :estado' : '1=1', { estado })
        .groupBy('c.numAutorizado')
        .addGroupBy('tr.tipoReporte')
        .orderBy('TOTAL', 'DESC')
        .getRawMany();
      return incidencia;
    } catch (err) {
      throw new Error('Error al generar el reporte de incidencias');
    }

  }

  async reportesUsuarios(id_Concesionaria: number, id_tipoReporte: number) {
    try {
      let incidencia = await this.reporteRepo
        .createQueryBuilder('reporte')
        .innerJoin('reporte.usuario', 'u')
        .addSelect('u.correo_electronico', 'Usuario')
        .addSelect('reporte.imagen', 'IMG')
        .addSelect('reporte.descripcion', 'Desc')
        .where('reporte.concesionaria , :consecionaria', {
          consecionaria: id_Concesionaria
        })
        .where('reportes.tipoReporte, :tipoReporte', {
          tipoReporte: id_tipoReporte
        })
        .getRawMany();
      return incidencia;

    } catch (err) {
      throw new Error('Error al generar el reporte de incidencias');
    }
  }

  async cambiarEstado(idReporte: number, idEstado: number) {
    const reporte = await this.reporteRepo.findOneBy({ id_Reporte: idReporte });
    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    reporte.estado = { id_Estado: idEstado } as Estado;
    return await this.reporteRepo.save(reporte);
  }

  async cambiarVariosEstados(idsReporte: number[], idEstado: number) {
    const reportes = await this.reporteRepo.findBy({ id_Reporte: In(idsReporte) });
    if (reportes.length === 0) {
      throw new Error('No se encontraron reportes');
    }

    for (const reporte of reportes) {
      reporte.estado = { id_Estado: idEstado } as Estado;
    }

    return await this.reporteRepo.save(reportes);
  }


  async findByUsuario(
    idUsuario: number,
    idEstado?: number,
  ) {
    const where: any = {
      usuario: { id_Usuario: idUsuario },
    };


    if (idEstado) {
      where.estado = { id_Estado: idEstado };
    }

    return await this.reporteRepo.find({
      where,
      relations: {
        estado: true,
        usuario: true,
      },
      order: {
        fecha_reporte: 'DESC',
      },
    });
  }







  async buscarReportes(filtros: FiltroReporteDto) {
    const page = Number(filtros.page) || 1;
    const limit = Number(filtros.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.reporteRepo.createQueryBuilder('r');

    // =============================
    // 🔹 FILTROS NORMALES
    // =============================

    if (filtros.fechaInicio && filtros.fechaFin) {
      qb.andWhere('r.fecha_reporte BETWEEN :inicio AND :fin', {
        inicio: filtros.fechaInicio,
        fin: filtros.fechaFin,
      });
    }

    if (filtros.estado) {
      qb.andWhere('r.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.tipoReporte) {
      qb.andWhere('r.tipoReporte = :tipoReporte', {
        tipoReporte: filtros.tipoReporte,
      });
    }

    if (filtros.concesionaria) {
      qb.andWhere('r.concesionaria = :concesionaria', {
        concesionaria: filtros.concesionaria,
      });
    }

    if (filtros.usuario) {
      qb.andWhere('r.usuario = :usuario', {
        usuario: filtros.usuario,
      });
    }

    if (filtros.conImagen === true) qb.andWhere('r.imagen IS NOT NULL');
    if (filtros.conImagen === false) qb.andWhere('r.imagen IS NULL');

    if (filtros.texto) {
      qb.andWhere('r.descripcion LIKE :texto', {
        texto: `%${filtros.texto}%`,
      });
    }

    // =============================
    // 🔹 MODO AGRUPADO (ADMIN)
    // =============================
    if (filtros.agrupar === true) {
      if (filtros.agruparConsecionaria) {
        qb
          .innerJoin('r.concesionaria', 'c')
          .addSelect('c.numAutorizado', 'concesionaria')
          .addSelect('COUNT(*)', 'total')
          .addGroupBy('c.numAutorizado');

      }

      if (filtros.agruparTipoReporte) {
        qb
          .innerJoin('r.tipoReporte', 'tr')
          .addSelect('tr.tipoReporte', 'tipoReporte')
          .addSelect('COUNT(*)', 'total')
          .addGroupBy('tr.tipoReporte');

      }



      qb.orderBy('total', filtros.orderTotal || 'DESC');

      const data = await qb.getRawMany();

      return {
        agrupado: true,
        data,
      };
    }

    // =============================
    // 🔹 MODO NORMAL (LISTADO)
    // =============================

    qb
      .leftJoinAndSelect('r.concesionaria', 'c')
      .leftJoinAndSelect('r.tipoReporte', 'tr')
      .leftJoinAndSelect('r.estado', 'e')
      .leftJoinAndSelect('r.usuario', 'u');

    // 📌 Orden por fecha (default: más reciente)
    qb.orderBy(
      'r.fecha_reporte',
      filtros.orderFecha || 'DESC'
    );

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      agrupado: false,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async dataReporteEcxcel(): Promise<Buffer> {
    const qb = this.reporteRepo.createQueryBuilder('r');

    qb.innerJoin('r.concesionaria', 'c')
      .innerJoin('r.tipoReporte', 'tr')
      .select('c.numAutorizado', 'concesionaria')
      .addSelect('tr.tipoReporte', 'tipoReporte')
      .addSelect('COUNT(*)', 'total')
      .groupBy('c.numAutorizado')
      .addGroupBy('tr.tipoReporte')
      .orderBy('total', 'DESC');

    const data = await qb.getRawMany();

    // 🔹 Crear Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte semanal');

    sheet.columns = [
      { header: 'Concesionaria', key: 'concesionaria', width: 20 },
      { header: 'Tipo Reporte', key: 'tipoReporte', width: 25 },
      { header: 'Total', key: 'total', width: 10 },
    ];

    data.forEach(row => sheet.addRow(row));

    // 🔹 Regresar como buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }



}








