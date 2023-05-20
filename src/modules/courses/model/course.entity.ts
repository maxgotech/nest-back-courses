import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { StudiesEntity } from "src/modules/studies/model/studies.entity";

@Entity('course')
export class CoursesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @OneToMany((type)=>ModuleEntity,(ModuleEntity)=>ModuleEntity.course)
    module:ModuleEntity[];

    @OneToMany((type)=>StudiesEntity,(StudiesEntity)=>StudiesEntity.course)
    study:StudiesEntity[];

    @Column({nullable:true})
    price:number;

    @Column({nullable:false})
    id_createdBy:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}