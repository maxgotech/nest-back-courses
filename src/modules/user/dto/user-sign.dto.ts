import { IsNotEmpty } from 'class-validator';

export class UserSignDto {
  @IsNotEmpty()
  userid: number;

  @IsNotEmpty()
  courseid: number
}