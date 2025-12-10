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
  Query,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Req
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { FiltroReporteDto } from './dto/find-reporte.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { CambiarVariosEstadosDto } from './dto/cambiar-varios-estados.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) { }



  @Post()
  @UseGuards(AuthGuard('jwt'))
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
    const userId = req.user.sub;
    if (!userId) {
      throw new Error('No se recibió el ID del usuario');
    }
    return this.reportesService.create(body, userId, file);//IMPORTANTE USARIO FIJO DEPENDE DEL ID QUE TENGA EN LA BASE DE DATOS  
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id', ParseIntPipe) idReporte: number,
    @Body() dto: CambiarEstadoDto,
  ) {
    try {
      return await this.reportesService.cambiarEstado(
        idReporte,
        dto.idEstado,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // 🔹 Cambiar estado de varios reportes
  @Patch('estado/masivo')
  async cambiarVariosEstados(
    @Body() dto: CambiarVariosEstadosDto,
  ) {
    try {
      return await this.reportesService.cambiarVariosEstados(
        dto.idsReporte,
        dto.idEstado,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }





  @Get('tipos')

  async buscarTipos() {
    return this.reportesService.findAllTipos();
  }


  @Get('estados')

  async buscarEstados() {
    return this.reportesService.findAllEstados();
  }

  @Get('buscar')
  buscar(@Query() filtros: FiltroReporteDto) {

    return this.reportesService.buscarReportes(filtros);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mis-reportes')
  async misReportes(
    @Req() req,
    @Query('idEstado', ParseIntPipe) idEstado?: number,
  ) {
    const idUsuario = req.user.id;

    return await this.reportesService.findByUsuario(
      idUsuario,
      idEstado,
    );
  }


}
