import {
    IsOptional,
    IsNumber,
    IsBoolean,
    IsString,
    IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FiltroReporteDto {

    @IsOptional()
    @IsString()
    fechaInicio?: string;

    @IsOptional()
    @IsString()
    fechaFin?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    estado?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    tipoReporte?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    concesionaria?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    usuario?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    agrupar?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    conImagen?: boolean;

    @IsOptional()
    @IsString()
    texto?: string;

    // paginación
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    // orden fecha
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    orderFecha?: 'ASC' | 'DESC';



    // orden total
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    orderTotal?: 'ASC' | 'DESC';
}
