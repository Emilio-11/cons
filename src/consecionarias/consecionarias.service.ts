import { Injectable } from '@nestjs/common';
import { CreateConsecionariaDto } from './dto/create-consecionaria.dto';
import { UpdateConsecionariaDto } from './dto/update-consecionaria.dto';
import * as QRCode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Concesionaria } from './entities/consecionaria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConsecionariasService {
  constructor(
    @InjectRepository(Concesionaria)
    private readonly concesionariaRepo: Repository<Concesionaria>,
  ) { }

  async generarQR(id: number): Promise<Buffer> {
    const data = `concesionaria:${id}`;
    return await QRCode.toBuffer(data);
  }

  async findOne(id: number) {
    return await this.concesionariaRepo.findOne({
      where: { id_Concesionaria: id },
    });
  }

  async findAll() {
    return await this.concesionariaRepo.find();
  }
}
