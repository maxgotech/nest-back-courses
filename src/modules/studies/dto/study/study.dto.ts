import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from 'src/modules/courses/model/course.entity';
import { ModuleEntity } from 'src/modules/courses/model/module.entity';

export class StudyDto {
  
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  id_content: number;

  type_content:number;

  @IsNotEmpty()
  id_createdBy: number;

  course:CoursesEntity;

  module:ModuleEntity;

  createdAt?: Date;

  updatedAt?: Date;
}