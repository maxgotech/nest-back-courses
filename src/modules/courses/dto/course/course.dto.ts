import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/modules/user/model/user.entity';

export class CourseDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  price?: number;

  image_path?: string;

  @IsNotEmpty()
  user: UserEntity;

  createdAt?: Date;

  updatedAt?: Date;
  
}