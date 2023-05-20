import { StudiesEntity } from "src/modules/studies/model/studies.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CoursesEntity } from "./course.entity";

@Entity('module')
export class ModuleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @ManyToOne((type) => CoursesEntity, (CoursesEntity) => CoursesEntity.id)
    course: CoursesEntity    

    @OneToMany((type) => StudiesEntity,(StudiesEntity) => StudiesEntity.id)
    study:StudiesEntity[]

    @Column({nullable:false})
    about:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}