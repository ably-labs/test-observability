import pluralize from "pluralize";
import {DescriptionListViewModel} from "src/utils/view/descriptionList";
import {ViewModelURLHelpers} from "src/utils/viewModel/urlHelpers";
import {TableViewModel} from "../utils/view/table";
import {Upload} from "./upload.entity";

export class UploadDetailsViewModel {
  constructor(private readonly upload: Upload) {}

  readonly title = `Details of upload ${this.upload.id}`

  readonly failuresTableIntroText = `There ${this.upload.failures.length == 1 ? "is" : "are"} ${this.upload.failures.length} ${pluralize("failure", this.upload.failures.length)} in this upload.`

  readonly failuresTable: TableViewModel = {
    headers: ['Failure ID', 'Test case ID', 'Test class', 'Test case', 'Message'],
    rows: this.upload.failures.map(failure => [
      {type: "link", text: failure.id, href: ViewModelURLHelpers.hrefForFailure(failure.id)},
      {type: "link", text: failure.testCase.id, href: ViewModelURLHelpers.hrefForTestCase(failure.testCase.id, null)},
      {type: "text", text: failure.testCase.testClassName},
      {type: "text", text: failure.testCase.testCaseName},
      {type: "text", text: failure.message},
    ])
  }

  readonly metadataDescriptionList: DescriptionListViewModel = {
    items: [
      {
        term: "Created at",
        description: {type: "text", text: this.upload.createdAt.toISOString()}
      },
      {
        term: "Total number of tests",
        description: {type: "text", text: String(this.upload.numberOfTests)}
      },
      {
        term: "JUnit report XML",
        description: {type: "link", text: "View report", href: ViewModelURLHelpers.hrefForJunitReportXml(this.upload.id)}
      },
      {
        term: "GitHub repository",
        description: {type: "link", text: this.upload.githubRepository, href: ViewModelURLHelpers.hrefForGitHubRepository(this.upload.githubRepository)}
      },
      {
        term: "Commit SHA",
        description: {type: "link", text: this.upload.githubSha.substring(0, 7), href: ViewModelURLHelpers.hrefForGitHubCommit(this.upload.githubRepository, this.upload.githubSha)}
      },
      {
        term: "Pull request base ref",
        description: {type: "text", text: this.upload.githubBaseRef}
      },
      {
        term: "Pull request head ref",
        description: {type: "text", text: this.upload.githubHeadRef}
      },
      {
        term: "Branch / tag name",
        description: {type: "text", text: this.upload.githubRefName}
      },
      {
        term: "Workflow asset retention period",
        description: {type: "text", text: `${this.upload.githubRetentionDays} days`}
      },
      {
        term: "GitHub action",
        description: {type: "text", text: this.upload.githubAction}
      },
      {
        term: "GitHub run ID",
        description: {type: "link", text: this.upload.githubRunId, href: ViewModelURLHelpers.hrefForGitHubRunId(this.upload.githubRepository, this.upload.githubRunId)}
      },
      {
        term: "GitHub run attempt",
        description: this.upload.githubRunAttempt == null ? {type: "text", text: "Not known"} : {type: "link", text: this.upload.githubRunAttempt.toString(), href: ViewModelURLHelpers.hrefForGitHubRunAttempt(this.upload.githubRepository, this.upload.githubRunId, this.upload.githubRunAttempt)}
      },
      {
        term: "GitHub run number",
        description: {type: "text", text: this.upload.githubRunNumber.toString()}
      },
      {
        term: "GitHub job",
        description: {type: "text", text: this.upload.githubJob}
      },
      {
        term: "Loop iteration",
        description: {type: "text", text: this.upload.iteration.toString()}
      },
    ]
  }
}
