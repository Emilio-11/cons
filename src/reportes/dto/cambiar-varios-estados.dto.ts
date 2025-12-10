import { IsArray, IsInt, IsPositive, ArrayNotEmpty } from 'class-validator';

export class CambiarVariosEstadosDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    idsReporte: number[];

    @IsInt()
    @IsPositive()
    idEstado: number;
}
