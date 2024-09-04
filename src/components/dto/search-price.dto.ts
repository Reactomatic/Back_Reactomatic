import { IsNumber, IsString } from 'class-validator';

export class SearchPriceDto {
  @IsNumber()
  price: number;

  @IsString()
  name: string;

  @IsString()
  brand: string;
}