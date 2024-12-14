import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  readonly recado: string;

  @IsNotEmpty()
  @IsPositive()
  readonly from: number;

  @IsNotEmpty()
  @IsPositive()
  readonly to: number;
}
