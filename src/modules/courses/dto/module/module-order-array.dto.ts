import { IsNotEmpty } from 'class-validator';

export class ModuleOrderDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  order:number;
  
}

export class ModuleOrderArrayDto {

    moduleArray:ModuleOrderDto[]

}