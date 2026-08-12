import { IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  @Type(() => Number)
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  lng?: number;
}
