import { IsNotEmpty } from 'class-validator';

export class PrimaryTagDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;
  
}