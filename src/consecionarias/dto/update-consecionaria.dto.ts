import { PartialType } from '@nestjs/mapped-types';
import { CreateConsecionariaDto } from './create-consecionaria.dto';

export class UpdateConsecionariaDto extends PartialType(CreateConsecionariaDto) {}
