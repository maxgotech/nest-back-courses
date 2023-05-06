import { IsNotEmpty } from 'class-validator';

export class CreateStudyDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  id_createdBy:number;
  
}