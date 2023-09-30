import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from '../../model/course.entity';

export class ModuleDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  module_order:number;

  about?: string;

  course?:CoursesEntity;

  createdAt?: Date;

  updatedAt?: Date;
  
}