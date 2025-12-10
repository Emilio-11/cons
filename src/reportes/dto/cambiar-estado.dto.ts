import { IsInt, IsPositive } from 'class-validator';

export class CambiarEstadoDto {
    @IsInt()
    @IsPositive()
    idEstado: number;
}
