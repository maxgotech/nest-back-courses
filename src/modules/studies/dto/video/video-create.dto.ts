import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
    
  @IsNotEmpty()
  id_video: string;

}