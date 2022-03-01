import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Failure} from "./failure.entity";

@Entity({name: "test_cases"})
@Index(["testClassName", "testCaseName"], {unique: true})
export class TestCase {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({name: "test_class_name"})
  testClassName!: string

  @Column({name: "test_case_name"})
  testCaseName!: string

  @OneToMany(() => Failure, failure => failure.testCase)
  failures!: Failure[]
}
