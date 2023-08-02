import { IsNotEmpty } from 'class-validator';

export class CreateUserFolderDto {
  @IsNotEmpty()
  name: string;
}