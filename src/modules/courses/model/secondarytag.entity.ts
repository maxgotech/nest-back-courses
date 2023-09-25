import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PrimaryTagEntity } from "./primarytag.entity";
@Entity('secondarytag')
export class SecondaryTagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name:string;

    @ManyToOne((type) => PrimaryTagEntity, (PrimaryTagEntity) => PrimaryTagEntity.id, { onDelete: 'CASCADE' })
    @JoinColumn({name:'primarytag'})
    primarytag:PrimaryTagEntity;
}