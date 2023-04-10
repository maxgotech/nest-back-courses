import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly mail: string;

  @IsNotEmpty()
  readonly password: string;
}