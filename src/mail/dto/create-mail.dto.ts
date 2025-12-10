import { IsString, IsEmail, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SendCorreoDto {
    @IsEmail()
    to: string;

    @IsString()
    @IsOptional()
    subject: string;

    @IsString()
    @IsOptional()
    text: string;



    @IsString()
    @IsOptional()
    html: string;




}