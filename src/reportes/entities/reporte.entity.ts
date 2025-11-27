// reporte.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoReporte } from './tipo-reporte.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Estado } from './estado.entity';
import { Concesionaria } from 'src/consecionarias/entities/consecionaria.entity';

@Entity('Reportes')
export class Reporte {
  @PrimaryColumn()
  id_Reporte: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.reportes)
  @JoinColumn({ name: 'usuario' })
  usuario: Usuario;

  @ManyToOne(() => TipoReporte, (tipo) => tipo.reportes)
  @JoinColumn({ name: 'tipoReporte' })
  tipoReporte: TipoReporte;

  @ManyToOne(() => Estado, (estado) => estado.reportes)
  @JoinColumn({ name: 'estado' })
  estado: Estado;

  @ManyToOne(() => Concesionaria, (concesionaria) => concesionaria.reportes)
  @JoinColumn({ name: 'concesionaria' })
  concesionaria: Concesionaria;

  @Column({ length: 300 })
  descripcion: string;

  @Column({ length: 200, nullable: true })
  imagen: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_reporte: Date;
}
