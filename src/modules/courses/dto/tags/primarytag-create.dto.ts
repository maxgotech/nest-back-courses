import { IsNotEmpty } from 'class-validator';

export class CreatePrimaryTagDto {

  @IsNotEmpty()
  name: string;
  
}