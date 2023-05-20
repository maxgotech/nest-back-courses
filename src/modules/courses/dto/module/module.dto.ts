import { IsNotEmpty } from 'class-validator';

export class ModuleDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  about: string;

  createdAt?: Date;

  updatedAt?: Date;
  
}