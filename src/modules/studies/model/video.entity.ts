import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('video')
export class VideoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    path:string;

    @Column({})
    length:string;

    @Column({})
    size:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}