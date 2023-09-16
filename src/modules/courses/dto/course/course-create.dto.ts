import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/modules/user/model/user.entity';

export class CreateCourseDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  translit: string;

  @IsNotEmpty()
  user:UserEntity;

  price?: number;
  
  image_path?:string;
  
}