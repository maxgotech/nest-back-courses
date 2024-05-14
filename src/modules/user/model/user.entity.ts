import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CoursesEntity } from "src/modules/courses/model/course.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    mail:string; // 255 chars

    @Column({nullable:false,select:false}) // Whenever you select the item with the password, you would have to explicitly "addSelect", otherwise this field is effectively excluded from general selects.
    password?:string;

    @Column({nullable:false})
    name:string;

    @Column({nullable:false})
    secondname:string;

    @Column({nullable:false,default:'student'})
    role: string;

    @Column({nullable:true,type:"text"})
    about:string;

    @Column({nullable:false,default:"/default/default.jpg"})
    pfp_path:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @ManyToMany(() => CoursesEntity, (signedCourse) => signedCourse.signedUsers, {cascade: ['insert','update']})
    @JoinTable()
    signedCourses:CoursesEntity[];

    @BeforeInsert()  
    async hashPassword() {this.password = await bcrypt.hash(this.password, 10)}
}