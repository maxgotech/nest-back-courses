import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  id_createdBy:number;

  price?: number;
  
}