import { IsNotEmpty } from 'class-validator';

export class TextDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  createdAt?: Date;

  updatedAt?: Date;
  
}