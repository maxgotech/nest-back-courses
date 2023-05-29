import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/modules/user/model/user.entity';

export class CreateStudyDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user:UserEntity;
  
}