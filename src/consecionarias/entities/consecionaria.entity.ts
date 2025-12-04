// concesionaria.entity.ts
import { Reporte } from 'src/reportes/entities/reporte.entity';
import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Consecionaria')
export class Concesionaria {
 @PrimaryGeneratedColumn()
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
