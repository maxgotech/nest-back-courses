import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('text')
export class TextEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    content:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}