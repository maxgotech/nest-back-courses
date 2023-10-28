import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/modules/user/model/user.entity';
import { CourseDescriptionEntity } from '../../model/coursedesc.entity';

export class CourseDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  translit: string;

  coursedesc:CourseDescriptionEntity

  price?: number;

  published: boolean;

  image_path?: string;

  @IsNotEmpty()
  user: UserEntity;

  createdAt?: Date;

  updatedAt?: Date;
  
}