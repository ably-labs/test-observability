import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm'

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
  @Column({name: 'github_run_number'})
  githubRunNumber: number

  // "GITHUB_RUN_ID - A unique number for each workflow run within a repository. This number does not change if you re-run the workflow run. For example, 1658821493."
  @Column({name: 'github_run_id'})
  githubRunId: string

  // If running the tests multiple times inside a single CI job, this is the number of the current iteration.
  @Column()
  iteration: number
}

