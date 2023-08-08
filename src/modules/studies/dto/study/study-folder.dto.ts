import { IsNotEmpty } from 'class-validator';

export class CreateStudyFolderDto {
  @IsNotEmpty()
  id: number;
}