import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from '../../model/course.entity';

export class CreateModuleDto {

  @IsNotEmpty()
  name: string;

  about?:string;

  course?:CoursesEntity;
  
}