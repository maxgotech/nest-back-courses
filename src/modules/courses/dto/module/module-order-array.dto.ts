import { IsNotEmpty } from 'class-validator';

export class ModuleOrderDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  module_order:number;
  
}

export class ModuleOrderArrayDto {

    moduleArray:ModuleOrderDto[]

}