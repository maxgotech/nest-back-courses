import { IsNotEmpty } from 'class-validator';
import { PrimaryTagEntity } from '../../model/primarytag.entity';

export class SecondaryTagDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  primarytag:PrimaryTagEntity
  
}