import { IsNotEmpty } from 'class-validator';

export class TextDto {

  @IsNotEmpty()
  id: number;

  content: string;

  @IsNotEmpty()
  rawtext: string;

  createdAt?: Date;

  updatedAt?: Date;
  
}