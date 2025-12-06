import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Reporte } from './entities/reporte.entity';
import { And, Between, Repository } from 'typeorm';
import { TipoReporte } from './entities/tipo-reporte.entity';

@Injectable()
export class ReportesService {
  private drive;
  private oauth2Client;

  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(TipoReporte)
    private readonly tipoReporte: Repository<TipoReporte>,
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

  async findByUser(idUser: number) {
    let reporte= await this.reporteRepo.find({where:{usuario:{id_usuario:idUser}}, relations:['concesionaria','estado','tipoReporte']})
    if(!reporte){
      throw new Error('No se encontraron reportes para este usuario');
    }
    return reporte;

  }

  async reportesIncidencia () {
    try{
      let incidencia= await this.reporteRepo
      .createQueryBuilder('reporte')
      .innerJoin('reporte.concesionaria','c')
      .innerJoin('reporte.tipoReporte','tr')
      .select('c.numAutorizado','AUT')
      .addSelect('tr.tipoReporte','tipo de reporte')
      .addSelect('COUNT * AS TOTAL')
      .groupBy('c.numAutorizado')
      .addGroupBy('tr.tipoReporte')
      .orderBy('DESC')
      .getMany();

      return incidencia;
    }catch(err){
      throw new Error('Error al generar el reporte de incidencias');
    }
    
  }
  async reportesIncidenciaFecha ( fechaI: Date , fechaF:Date ) {
    try{
      let incidencia= await this.reporteRepo
      .createQueryBuilder('reporte')
      .innerJoin('reporte.concesionaria','c')
      .innerJoin('reporte.tipoReporte','tr')
      .select('c.numAutorizado','AUT')
      .addSelect('tr.tipoReporte','tipo de reporte')
      .addSelect('COUNT * AS TOTAL')
      .where('reporte.fecha_reporte, BETWEEN :inicio AND :fin', {
        inicio:fechaI,
        fin:fechaF
      })
      .groupBy('c.numAutorizado')
      .addGroupBy('tr.tipoReporte')
      .getRawMany();
      return incidencia;
    }catch(err){
      throw new Error('Error al generar el reporte de incidencias');
    }
    
  }

    async reportesUsuarios( id_Concesionaria:number, id_tipoReporte:number){
      try{
        let incidencia = await this.reporteRepo
        .createQueryBuilder('reporte')
        .innerJoin('reporte.usuario','u')
        .addSelect('u.correo_electronico','Usuario')
        .addSelect('reporte.imagen','IMG')
        .addSelect('reporte.descripcion','Desc')
        .where('reporte.concesionaria , :consecionaria',{
          consecionaria:id_Concesionaria
        })
        .where('reportes.tipoReporte, :tipoReporte',{
          tipoReporte:id_tipoReporte
        } )
        .getRawMany();
        return incidencia;

      } catch(err){
        throw new Error('Error al generar el reporte de incidencias');
    }
      }

}


  





