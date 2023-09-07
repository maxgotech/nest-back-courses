import { IsNotEmpty } from 'class-validator';

export class VideoDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  id_video: string;

  createdAt?: Date;

  updatedAt?: Date;
  
}