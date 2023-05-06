import { IsNotEmpty } from 'class-validator';

export class CreateTextDto {
    
  @IsNotEmpty()
  rawtext: string;

  content: string;

}