import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res
} from '@nestjs/common';
import { ConsecionariasService } from './consecionarias.service';
import { CreateConsecionariaDto } from './dto/create-consecionaria.dto';
import { UpdateConsecionariaDto } from './dto/update-consecionaria.dto';
import type { Response } from "express";


@Controller('consecionarias')
export class ConsecionariasController {
  constructor(private readonly consecionariasService: ConsecionariasService) { }

  @Get("download/:id")
  async downloadQr(@Param("id") id: string, @Res() res: Response) {
    const buffer = await this.consecionariasService.generarQR(Number(id));

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename=qr-${id}.png`);
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.consecionariasService.findOne(id);
  }


}
