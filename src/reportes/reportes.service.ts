import { Injectable } from '@nestjs/common';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { google } from 'googleapis';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Reporte } from './entities/reporte.entity';
import { Repository } from 'typeorm';
import { TipoReporte } from './entities/tipo-reporte.entity';

@Injectable()
export class ReportesService {
  private drive;

  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(TipoReporte)
    private readonly tipoReporte: Repository<TipoReporte>,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'google_credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: Express.Multer.File, userId: number) {
    /*const random = Math.random().toString(36).substring(2, 10);
    const extension = file.originalname.split('.').pop();
    const fileName = `${userId}-${random}.${extension}`;

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id',
    });

    // hacerlo público
    await this.drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });
*/  // <-Problemas con el drive
    return {
      url: file.path,
      fileName: file.originalname,
    };
  }

  async create(
    dto: CreateReporteDto,
    idUser: number,
    file?: Express.Multer.File,
  ) {
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
}
