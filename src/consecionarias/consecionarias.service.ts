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
  ) {}
  async generarQr(idConcesionaria: number) {
    const data = `concesionaria=${idConcesionaria}`;

    const qr = await QRCode.toDataURL(data);

    return qr;
  }

  async findOne(id: number) {
    return await this.concesionariaRepo.findOne({
      where: { id_Concesionaria: id },
    });
  }
}
