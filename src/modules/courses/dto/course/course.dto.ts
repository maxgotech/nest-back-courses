import { IsNotEmpty } from 'class-validator';

export class CourseDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  price?: number;

  @IsNotEmpty()
  id_createdBy: number;

  createdAt?: Date;

  updatedAt?: Date;
  
}