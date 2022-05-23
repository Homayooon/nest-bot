import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export enum FileStatus {
    Temp = 'Temp',
    Perma = 'Permanent',

}
@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    tempId: string;

    @Column()
    userId: number;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({enum: FileStatus})
    status: string;


    @CreateDateColumn()
    createdDate: string;

    @UpdateDateColumn()
    updatedDate: string;

    @DeleteDateColumn()
    deletedDate: string;


}
