import { StudiesEntity } from "src/modules/studies/model/studies.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CoursesEntity } from "./course.entity";

@Entity('module')
export class ModuleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @Column({default:1})
    module_order:number;

    @ManyToOne((type) => CoursesEntity, (CoursesEntity) => CoursesEntity.id, { onDelete: 'CASCADE' })
    @JoinColumn({name:'courseid'})
    course:CoursesEntity;

    @OneToMany((type) => StudiesEntity,(StudiesEntity) => StudiesEntity.module)
    study:StudiesEntity[];

    @Column({nullable:true})
    about:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}