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
import { AuthGuard } from '@nestjs/passport';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Request() req,
    @Body() body: CreateReporteDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.reportesService.create(body, req.user.sub, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async buscar() {
    return await this.reportesService.findAllTipos();
  }
}
