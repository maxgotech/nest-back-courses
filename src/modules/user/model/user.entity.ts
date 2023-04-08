import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    login:string; // 255 chars

    @Column({nullable:false})
    passwordHash?:string;

    @Column({nullable:false})
    Name:string;

    @Column({nullable:false})
    SecondName:string;

    @Column({nullable:true})
    About:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}