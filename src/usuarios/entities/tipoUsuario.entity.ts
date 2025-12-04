// tipo-usuario.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('tipo_usuario')
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id_tipoUsuario: number; 

  @Column({ length: 50 })
  tipoUsuario: string;

  @OneToMany(() => Usuario, (usuario) => usuario.tipoUsuario)
  usuarios: Usuario[];
}
