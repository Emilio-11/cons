// estado.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Reporte } from './reporte.entity';

@Entity('Estado')
export class Estado {
  @PrimaryColumn()
  id_Estado: number;

  @Column({ length: 50 })
  estado: string;

  @OneToMany(() => Reporte, (reporte) => reporte.estado)
  reportes: Reporte[];
}
