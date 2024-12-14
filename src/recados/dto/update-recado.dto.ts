import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  readonly recado?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly seen?: boolean;
}
