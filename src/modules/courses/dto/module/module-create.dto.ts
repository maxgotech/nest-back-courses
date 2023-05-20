import { IsNotEmpty } from 'class-validator';

export class CreateModuleDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  about:string;
  
}