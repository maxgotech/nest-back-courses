import { IsNotEmpty } from 'class-validator';
import { PrimaryTagEntity } from '../../model/primarytag.entity';

export class CreateSecondaryTagDto {

  @IsNotEmpty()
  name: string;

  primarytag:PrimaryTagEntity
  
}