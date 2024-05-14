import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { StudiesEntity } from "src/modules/studies/model/studies.entity";
import { UserEntity } from "src/modules/user/model/user.entity";
import { CourseDescriptionEntity } from "./coursedesc.entity";
import { PrimaryTagEntity } from "./primarytag.entity";
import { SecondaryTagEntity } from "./secondarytag.entity";

@Entity('course')
export class CoursesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @Column({nullable:false})
    translit:string;

    @OneToOne(() => CourseDescriptionEntity, (CourseDescriptionEntity) => CourseDescriptionEntity.course, { onDelete: "CASCADE" })
    coursedesc:CourseDescriptionEntity;

    @Column({nullable:true,default:'/default/course-default.png'})
    image_path:string;

    @OneToMany(() => ModuleEntity, (ModuleEntity) => ModuleEntity.course)
    module:ModuleEntity[];

    @OneToMany(() => StudiesEntity, (StudiesEntity) => StudiesEntity.course)
    study:StudiesEntity[];

    @Column({nullable:true})
    price:number;

    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id)
    @JoinColumn({name:'userid'})
    user: UserEntity

    @ManyToMany(() => UserEntity, (signedUser) => signedUser.signedCourses, { cascade: true})
    signedUsers: UserEntity[];

    @ManyToOne(() => PrimaryTagEntity, (PrimaryTagEntity) => PrimaryTagEntity.id)
    @JoinColumn({name:'primarytagid'})
    primarytag: PrimaryTagEntity

    @ManyToOne(() => SecondaryTagEntity, (SecondaryTagEntity) => SecondaryTagEntity.id)
    @JoinColumn({name:'secondarytagid'})
    secondarytag: SecondaryTagEntity

    @Column({nullable:false,default:false})
    published:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}