import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('text')
export class TextEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false,type:"mediumtext"})
    content:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}