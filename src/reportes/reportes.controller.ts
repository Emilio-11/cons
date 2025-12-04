import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

 
 
@Post()
@UseInterceptors(
  FileInterceptor("imagen", {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique);
      }
    })
  })
)
async create(
  @Request() req,
  @Body() body,
  @UploadedFile() file: Express.Multer.File
) {
  console.log("FILE >>>", file);
  return this.reportesService.create(body, 15, file);//IMPORTANTE USARIO FIJO DEPENDE DEL ID QUE TENGA EN LA BASE DE DATOS  
}



 
  @Get()
  async buscar() {
     
    return await this.reportesService.findAllTipos();
  }
}
