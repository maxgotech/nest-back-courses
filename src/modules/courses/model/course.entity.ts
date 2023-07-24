import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { StudiesEntity } from "src/modules/studies/model/studies.entity";
import { UserEntity } from "src/modules/user/model/user.entity";
import { CourseDescriptionEntity } from "./coursedesc.entity";

@Entity('course')
export class CoursesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @OneToOne(()=>CourseDescriptionEntity,(CourseDescriptionEntity)=>CourseDescriptionEntity.course, { onDelete: "CASCADE" })
    coursedesc:CourseDescriptionEntity;

    @Column({nullable:true,default:'https://blog.coursify.me/wp-content/uploads/2019/09/online-education-coursifyme.jpg'})
    image_path:string;

    @OneToMany((type)=>ModuleEntity,(ModuleEntity)=>ModuleEntity.course)
    module:ModuleEntity[];

    @OneToMany((type)=>StudiesEntity,(StudiesEntity)=>StudiesEntity.course)
    study:StudiesEntity[];

    @Column({nullable:true})
    price:number;

    @ManyToOne((type) => UserEntity, (UserEntity) => UserEntity.id)
    @JoinColumn({name:'userid'})
    user: UserEntity

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}