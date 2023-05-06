import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('text')
export class TextEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    content:string;

    @Column({nullable:false})
    rawtext:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}