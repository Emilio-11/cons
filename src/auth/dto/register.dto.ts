import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  pass: string;

  @IsOptional()
  @IsInt()
  tipoUsuario?: number; // opcional si lo quieres asignar por defecto
}
