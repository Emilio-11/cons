import { Module } from '@nestjs/common';
import { ConsecionariasService } from './consecionarias.service';
import { ConsecionariasController } from './consecionarias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concesionaria } from './entities/consecionaria.entity';
import { Reporte } from 'src/reportes/entities/reporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concesionaria, Reporte])],
  controllers: [ConsecionariasController],
  providers: [ConsecionariasService],
  exports: [ConsecionariasService],
})
export class ConsecionariasModule {}
