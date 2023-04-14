import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  secondname: string;

  @IsNotEmpty()
  @IsEmail()
  mail: string;

  about: string;

  createdAt?: Date;

  updatedAt?: Date;
}