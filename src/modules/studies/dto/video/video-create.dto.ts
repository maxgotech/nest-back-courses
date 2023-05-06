import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
    
  @IsNotEmpty()
  path: string;
  
  length: string;
  
  size: number;

}