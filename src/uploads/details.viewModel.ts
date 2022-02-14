import {DescriptionListViewModel} from "src/utils/view/descriptionList";
import {TableViewModel} from "../utils/view/table";
import {Report} from "./report";

export class ReportDetailsViewModel {
  constructor(private readonly report: Report) {}

  readonly title = `Details of upload ${this.report.upload.id}`

  readonly failuresTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Message'],
    rows: this.report.junitReport.failures.map(failure => [
      {type: "text", text: failure.testClassName},
      {type: "link", text: failure.testCaseName, href: this.hrefForFailureDetails(failure.testClassName, failure.testCaseName)},
      {type: "text", text: failure.message},
    ])
  }

  readonly metadataDescriptionList: DescriptionListViewModel = {
    items: [
      {
        term: "Created at",
        description: {type: "text", text: this.report.upload.createdAt.toISOString()}
      },
      {
        term: "JUnit report XML",
        description: {type: "link", text: "View report", href: this.hrefForJunitReportXml(this.report.upload.id)}
      },
      {
        term: "Commit SHA",
        description: {type: "link", text: this.report.upload.githubSha.substring(0, 7), href: this.hrefForGitHubCommit(this.report.upload.githubSha)}
      },
      {
        term: "Pull request base ref",
        description: {type: "text", text: this.report.upload.githubBaseRef?.length ? this.report.upload.githubHeadRef : "Not known"}
      },
      {
        term: "Pull request head ref",
        description: {type: "text", text: this.report.upload.githubHeadRef?.length ? this.report.upload.githubHeadRef : "Not known"}
      },
      {
        term: "Branch / tag name",
        description: {type: "text", text: this.report.upload.githubRefName}
      },
      {
        term: "Workflow asset retention period",
        description: {type: "text", text: `${this.report.upload.githubRetentionDays} days`}
      },
      {
        term: "GitHub action",
        description: {type: "text", text: this.report.upload.githubAction}
      },
      {
        term: "GitHub run ID",
        description: {type: "link", text: this.report.upload.githubRunId, href: `https://github.com/ably/ably-cocoa/actions/runs/${this.report.upload.githubRunId}`}
      },
      {
        term: "GitHub run attempt",
        description: this.report.upload.githubRunAttempt == null ? {type: "text", text: "Not known"} : {type: "link", text: this.report.upload.githubRunAttempt.toString(), href: `https://github.com/ably/ably-cocoa/actions/runs/${this.report.upload.githubRunId}/attempts/${this.report.upload.githubRunAttempt}`}
      },
      {
        term: "GitHub run number",
        description: {type: "text", text: this.report.upload.githubRunNumber.toString()}
      },
      {
        term: "GitHub job",
        description: {type: "text", text: this.report.upload.githubJob?.length ? this.report.upload.githubJob : "Not known"}
      },
      {
        term: "Loop iteration",
        description: {type: "text", text: this.report.upload.iteration.toString()}
      },
    ]
  }

  // TODO DRY up with overview view model
  private hrefForFailureDetails(testClassName: string, testCaseName: string) {
    // TODO escape
    return `/uploads/failure?test_class_name=${testClassName}&test_case_name=${testCaseName}`
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
