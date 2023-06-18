import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from '../../model/course.entity';

export class CourseDescDto {

  @IsNotEmpty()
  id: number;

  course?:CoursesEntity

  learn:string;

  req:string;

  about:string;

  audience:string;

  createdAt?: Date;

  updatedAt?: Date;
  
}