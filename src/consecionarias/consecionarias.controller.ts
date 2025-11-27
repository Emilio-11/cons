import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsecionariasService } from './consecionarias.service';
import { CreateConsecionariaDto } from './dto/create-consecionaria.dto';
import { UpdateConsecionariaDto } from './dto/update-consecionaria.dto';

@Controller('consecionarias')
export class ConsecionariasController {
  constructor(private readonly consecionariasService: ConsecionariasService) {}

  @Get(':id')
  async generar(@Param('id') id: number) {
    return await this.consecionariasService.generarQr(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.consecionariasService.findOne(id);
  }
}
