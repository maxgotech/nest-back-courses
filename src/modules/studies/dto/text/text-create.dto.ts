import { IsNotEmpty } from 'class-validator';

export class CreateTextDto {
    
  @IsNotEmpty()
  content: string;

}