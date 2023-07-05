import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CoursesEntity } from "./course.entity";

@Entity('coursedesc')
export class CourseDescriptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> CoursesEntity,(CoursesEntity)=>CoursesEntity.coursedesc)
    @JoinColumn({name:'course'})
    course:CoursesEntity;

    @Column({nullable:false,type:"text"})
    shortabout:string;

    @Column({nullable:false,type:"text"})
    learn:string;

    @Column({nullable:false,type:"text"})
    req:string;

    @Column({nullable:false,type:"mediumtext"})
    about:string;

    @Column({nullable:false,type:"text"})
    audience:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}