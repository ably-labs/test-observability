import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TestCase} from "./testCase.entity";
import {Upload} from "./upload.entity";

@Entity({name: "failures", orderBy: {order: "ASC"}})
@Index(["id", "order"], {unique: true})
export class Failure {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Upload, upload => upload.failures, {nullable: false})
  @JoinColumn({name: "upload_id"})
  upload: Upload

  @ManyToOne(() => TestCase, testCase => testCase.failures, {nullable: false})
  @JoinColumn({name: "test_case_id"})
  testCase: TestCase

  // The position of this failure within the list of the parent Upload’s failures. Starts at 0.
  @Column()
  order: number

  @Column()
  message: string
}
