import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SecondaryTagEntity } from "./secondarytag.entity";
@Entity('primarytag')
export class PrimaryTagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @Column({nullable:false})
    translation:string;

    @OneToMany((type)=>SecondaryTagEntity,(SecondaryTagEntity)=>SecondaryTagEntity.primarytag)
    seondarytags:SecondaryTagEntity[];
}