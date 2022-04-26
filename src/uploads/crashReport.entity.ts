import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Failure } from './failure.entity';

@Entity({ name: 'crash_reports' })
export class CrashReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  filename!: string;

  @Column()
  data!: string;

  @ManyToOne(() => Failure, (failure) => failure.crashReports, {
    nullable: false,
  })
  @JoinColumn({ name: 'failure_id' })
  failure!: Failure;
}
