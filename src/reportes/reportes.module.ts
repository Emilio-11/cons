import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Concesionaria } from 'src/consecionarias/entities/consecionaria.entity';
import { Estado } from './entities/estado.entity';
import { TipoReporte } from './entities/tipo-reporte.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Reporte } from './entities/reporte.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reporte,
      Usuario,
      TipoReporte,
      Estado,
      Concesionaria,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
