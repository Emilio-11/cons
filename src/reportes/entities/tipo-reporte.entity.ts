// tipo-reporte.entity.ts
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reporte } from './reporte.entity';

@Entity('tipo_Reporte')
export class TipoReporte {
  @PrimaryGeneratedColumn()
  id_tipoReporte: number;

  @Column({ length: 50 })
  tipoReporte: string;

  @OneToMany(() => Reporte, (reporte) => reporte.tipoReporte)
  reportes: Reporte[];
}
