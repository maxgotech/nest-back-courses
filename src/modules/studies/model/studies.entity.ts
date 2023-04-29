import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('study')
export class StudiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @Column({nullable:true})
    id_content:number;

    @Column({nullable:true})
    type_content:number;  // 1 - text
                          // 2 - video 

    @Column({nullable:false})
    id_createdBy:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}