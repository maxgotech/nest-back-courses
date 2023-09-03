import { IsNotEmpty } from 'class-validator';

export class VideoDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  id_video: string;

  length: string;

  size: number;

  createdAt?: Date;

  updatedAt?: Date;
  
}