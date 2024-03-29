import { CoursesEntity } from "src/modules/courses/model/course.entity";
import { ModuleEntity } from "src/modules/courses/model/module.entity";
import { UserEntity } from "src/modules/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('study')
export class StudiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @Column({default:1})
    study_order:number;

    @ManyToOne((type) => CoursesEntity, (CoursesEntity) => CoursesEntity.id)
    @JoinColumn({name:'courseid'})
    course: CoursesEntity

    @ManyToOne((type) => ModuleEntity, (ModuleEntity) => ModuleEntity.id)
    @JoinColumn({name:'moduleid'})
    module: ModuleEntity

    @Column({nullable:true})
    id_content:number;

    @Column({nullable:true})
    id_kinescope_folder:string;

    @Column({nullable:true})
    type_content:number;  // 1 - text
                          // 2 - video 

    @ManyToOne((type) => UserEntity, (UserEntity) => UserEntity.id)
    @JoinColumn({name:'userid'})
    user: UserEntity

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}