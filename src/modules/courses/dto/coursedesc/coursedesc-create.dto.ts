import { CoursesEntity } from '../../model/course.entity';

export class CreateCourseDescDto {

  course?:CoursesEntity;

  learn:string;

  req:string;

  about:string;

  audience:string;
  
}