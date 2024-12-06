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

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  @IsOptional()
  readonly from?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  @IsOptional()
  readonly to?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly seen?: boolean;
}
