import {DescriptionListViewModel} from "src/utils/view/descriptionList";
import {TableViewModel} from "../utils/view/table";
import {Upload} from "./upload.entity";

export class UploadDetailsViewModel {
  constructor(private readonly upload: Upload) {}

  readonly title = `Details of upload ${this.upload.id}`

  readonly failuresTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Message'],
    rows: this.upload.failures.map(failure => [
      {type: "text", text: failure.testCase.testClassName},
      {type: "link", text: failure.testCase.testCaseName, href: this.hrefForTestCase(failure.testCase.id)},
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
        term: "JUnit report XML",
        description: {type: "link", text: "View report", href: this.hrefForJunitReportXml(this.upload.id)}
      },
      {
        term: "Commit SHA",
        description: {type: "link", text: this.upload.githubSha.substring(0, 7), href: this.hrefForGitHubCommit(this.upload.githubSha)}
      },
      {
        term: "Pull request base ref",
        description: {type: "text", text: this.upload.githubBaseRef?.length ? this.upload.githubBaseRef : "Not known"}
      },
      {
        term: "Pull request head ref",
        description: {type: "text", text: this.upload.githubHeadRef?.length ? this.upload.githubHeadRef : "Not known"}
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
        description: {type: "link", text: this.upload.githubRunId, href: `https://github.com/ably/ably-cocoa/actions/runs/${this.upload.githubRunId}`}
      },
      {
        term: "GitHub run attempt",
        description: this.upload.githubRunAttempt == null ? {type: "text", text: "Not known"} : {type: "link", text: this.upload.githubRunAttempt.toString(), href: `https://github.com/ably/ably-cocoa/actions/runs/${this.upload.githubRunId}/attempts/${this.upload.githubRunAttempt}`}
      },
      {
        term: "GitHub run number",
        description: {type: "text", text: this.upload.githubRunNumber.toString()}
      },
      {
        term: "GitHub job",
        description: {type: "text", text: this.upload.githubJob?.length ? this.upload.githubJob : "Not known"}
      },
      {
        term: "Loop iteration",
        description: {type: "text", text: this.upload.iteration.toString()}
      },
    ]
  }

  // TODO DRY up with overview view model
  private hrefForTestCase(id: string) {
    // TODO escape
    return `/test_cases/${id}`
  }

  private hrefForGitHubCommit(sha: string) {
    // TODO escape
    return `https://github.com/ably/ably-cocoa/commit/${sha}`
  }

  private hrefForJunitReportXml(id: string) {
    // TODO escape
    return `/uploads/${id}/junit_report_xml`
  }
}
