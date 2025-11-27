import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reporte } from 'src/reportes/entities/reporte.entity';
import { Usuario } from './entities/usuario.entity';
import { TipoUsuario } from './entities/tipoUsuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUsuario, Reporte, Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
