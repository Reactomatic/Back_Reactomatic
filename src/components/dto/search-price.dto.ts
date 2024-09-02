import { IsString } from 'class-validator';

export class SearchPriceDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;
}