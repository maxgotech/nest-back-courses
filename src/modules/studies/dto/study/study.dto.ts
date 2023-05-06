import { IsNotEmpty } from 'class-validator';

export class StudyDto {
  
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  id_content: number;

  type_content:number;

  @IsNotEmpty()
  id_createdBy: number;

  createdAt?: Date;

  updatedAt?: Date;
}