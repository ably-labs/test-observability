import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Failure} from './failure.entity'

@Entity({name: "uploads"})
export class Upload {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date

  @Column("xml", {name: 'junit_report_xml'})
  junitReportXml: string

  // "GITHUB_SHA - The commit SHA that triggered the workflow. For example, ffac537e6cbbf934b08745a378932722df287a53."
  @Column({name: 'github_sha'})
  githubSha: string

  // "GITHUB_REF_NAME - The branch or tag name that triggered the workflow run."
  @Column({name: 'github_ref_name'})
  githubRefName: string

  // "GITHUB_RETENTION_DAYS - The number of days that workflow run logs and artifacts are kept. For example, 90."
  @Column({name: 'github_retention_days'})
  githubRetentionDays: number

  // "GITHUB_ACTION - The name of the action currently running, or the id of a step. For example, for an action, __repo-owner_name-of-action-repo."
  @Column({name: 'github_action'})
  githubAction: string

  // "GITHUB_RUN_NUMBER - A unique number for each run of a particular workflow in a repository. This number begins at 1 for the workflow's first run, and increments with each new run. This number does not change if you re-run the workflow run. For example, 3."
  // OK, so this is not the "attempt", it's the 20 in the page heading "1279 run tests in loop Integration Test: iOS 14.4 #20"
  @Column({name: 'github_run_number'})
  githubRunNumber: number

  // "GITHUB_RUN_ATTEMPT" – A unique number for each attempt of a particular workflow run in a repository. This number begins at 1 for the workflow run's first attempt, and increments with each re-run. For example, 3.
  // This is nullable because I forgot to include it in the original schema, so there are some records without it captured. But we expect it to be non-null for new records.
  @Column({name: 'github_run_attempt', nullable: true})
  githubRunAttempt: number

  // "GITHUB_RUN_ID - A unique number for each workflow run within a repository. This number does not change if you re-run the workflow run. For example, 1658821493."
  @Column({name: 'github_run_id'})
  githubRunId: string

  // "GITHUB_BASE_REF" – The name of the base ref or target branch of the pull request in a workflow run.This is only set when the event that triggers a workflow run is either pull_request or pull_request_target. For example, main.
  // This is nullable because I forgot to include it in the original schema, so there are some records without it captured. And it may also be null for new records that don’t come from a pull request.
  // TODO validations / normalisations
  @Column({name: 'github_base_ref', nullable: true})
  githubBaseRef: string

  // "GITHUB_HEAD_REF" – The head ref or source branch of the pull request in a workflow run. This property is only set when the event that triggers a workflow run is either pull_request or pull_request_target. For example, feature-branch-1.
  // This is nullable because I forgot to include it in the original schema, so there are some records without it captured. And it may also be null for new records that don’t come from a pull request.
  // TODO validations / normalisations - are we using null or empty string? It's probably gonna be empty string for simplicity's sake for now
  @Column({name: 'github_head_ref', nullable: true})
  githubHeadRef: string

  // "GITHUB_JOB" – The job_id of the current job. For example, greeting_job.
  // This is nullable because I forgot to include it in the original schema, so there are some records without it captured. But we expect it to be non-null for new records.
  @Column({name: 'github_job', nullable: true})
  githubJob: string

  // If running the tests multiple times inside a single CI job, this is the number of the current iteration.
  @Column()
  iteration: number

  @OneToMany(() => Failure, failure => failure.upload)
  failures: Failure[]
}

