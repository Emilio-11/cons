// usuario.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TipoUsuario } from './tipoUsuario.entity';
import { Reporte } from 'src/reportes/entities/reporte.entity';

@Entity('Usuarios')
export class Usuario {
  @PrimaryColumn()
  id_usuario: number;

  @Column({ unique: true, length: 100 })
  correo_electronico: string;

  @Column({ length: 100 })
  contraseña: string;

  @ManyToOne(() => TipoUsuario, (tipo) => tipo.usuarios)
  @JoinColumn({ name: 'tipoUsuario' })
  tipoUsuario: TipoUsuario;

  @OneToMany(() => Reporte, (reporte) => reporte.usuario)
  reportes: Reporte[];
}
