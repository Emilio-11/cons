// tipo-reporte.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Reporte } from './reporte.entity';

@Entity('tipo_Reporte')
export class TipoReporte {
  @PrimaryColumn()
  id_tipoReporte: number;

  @Column({ length: 50 })
  tipoReporte: string;

  @OneToMany(() => Reporte, (reporte) => reporte.tipoReporte)
  reportes: Reporte[];
}
