// estado.entity.ts
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reporte } from './reporte.entity';

@Entity('Estado')
export class Estado {
 @PrimaryGeneratedColumn()
  id_Estado: number;

  @Column({ length: 50 })
  estado: string;

  @OneToMany(() => Reporte, (reporte) => reporte.estado)
  reportes: Reporte[];
}
