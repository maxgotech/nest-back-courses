import { IsNotEmpty } from 'class-validator';

export class CreateCourseFolderDto {
  @IsNotEmpty()
  id: number;
}