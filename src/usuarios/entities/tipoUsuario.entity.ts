// tipo-usuario.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('tipo_usuario')
export class TipoUsuario {
  @PrimaryColumn()
  id_tipoUsuario: number;

  @Column({ length: 50 })
  tipoUsuario: string;

  @OneToMany(() => Usuario, (usuario) => usuario.tipoUsuario)
  usuarios: Usuario[];
}
