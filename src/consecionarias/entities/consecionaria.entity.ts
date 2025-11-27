// concesionaria.entity.ts
import { Reporte } from 'src/reportes/entities/reporte.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('Consecionaria')
export class Concesionaria {
  @PrimaryColumn()
  id_Concesionaria: number;

  @Column()
  numAutorizado: string;

  @Column()
  dependencia: string;

  @Column({ nullable: true })
  localidad: string;

  @Column()
  autorizado: string;

  @Column({ nullable: true })
  horario_atencion: string;

  @OneToMany(() => Reporte, (reporte) => reporte.concesionaria)
  reportes: Reporte[];
}
