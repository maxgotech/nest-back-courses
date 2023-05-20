import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from '../../model/course.entity';

export class CreateModuleDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  about:string;

  course?:CoursesEntity;
  
}