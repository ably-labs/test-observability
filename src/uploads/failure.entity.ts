import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Upload} from "./upload.entity";

@Entity({name: "failures", orderBy: {order: "ASC"}})
@Index(["id", "order"], {unique: true})
export class Failure {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Upload, upload => upload.failures, {nullable: false})
  @JoinColumn({name: "upload_id"})
  upload: Upload

  // The position of this failure within the list of the parent Upload’s failures. Starts at 0.
  @Column()
  order: number

  @Column()
  message: string
}
