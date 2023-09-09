import { IsNotEmpty } from 'class-validator';
import { CoursesEntity } from 'src/modules/courses/model/course.entity';
import { ModuleEntity } from 'src/modules/courses/model/module.entity';
import { UserEntity } from 'src/modules/user/model/user.entity';

export class StudyDto {
  
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  id_content: number;

  type_content:number;

  id_kinescope_folder:string;

  @IsNotEmpty()
  user: UserEntity;

  course:CoursesEntity;

  module:ModuleEntity;

  createdAt?: Date;

  updatedAt?: Date;
}