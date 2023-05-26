import { CoursesEntity } from "src/modules/courses/model/course.entity";
import { ModuleEntity } from "src/modules/courses/model/module.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('study')
export class StudiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @ManyToOne((type) => CoursesEntity, (CoursesEntity) => CoursesEntity.id)
    @JoinColumn({name:'courseid'})
    course: CoursesEntity

    @ManyToOne((type) => ModuleEntity, (ModuleEntity) => ModuleEntity.id)
    @JoinColumn({name:'moduleid'})
    module: ModuleEntity

    @Column({nullable:true})
    id_content:number;

    @Column({nullable:true})
    type_content:number;  // 1 - text
                          // 2 - video 

    @Column({nullable:false})
    id_createdBy:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}