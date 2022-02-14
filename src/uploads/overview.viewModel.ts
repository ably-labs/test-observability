import {TableViewModel} from "../utils/view/table"
import {MultiReport} from "./multiReport"

export class OverviewViewModel {
  constructor(private readonly multiReport: MultiReport) {}

  readonly table: TableViewModel = {
    headers: [
      'ID',
      'Uploaded at',
      'Iteration',
      'Total number of tests',
      'Number of failures',
    ],

    rows: this.multiReport.reports.map(report => {
      return [
        {type: "link", text: report.upload.id, href: this.hrefForUploadDetails(report.upload.id)},
        {type: "text", text: report.upload.createdAt.toISOString()},
        {type: "text", text: String(report.upload.iteration)},
        {type: "text", text: String(report.junitReport.numberOfTests)},
        {type: "text", text: String(report.junitReport.numberOfFailures)}
      ]
    })
  }

  readonly failureOccurrencesTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Number of occurrences', 'Last seen'],
    rows: this.multiReport.failuresByDescendingOccurrenceOrder.map(failure => [
      {type: "text", text: failure.failure.testClassName},
      {type: "link", text: failure.failure.testCaseName, href: this.hrefForFailureDetails(failure.failure.testClassName, failure.failure.testCaseName)},
      {type: "text", text: String(failure.occurrenceCount)},
      {type: "link", text: failure.lastSeenIn.createdAt.toISOString(), href: this.hrefForUploadDetails(failure.lastSeenIn.id)}
    ])
  }

  private hrefForUploadDetails(id: string) {
    return `/uploads/${id}`
  }

  private hrefForFailureDetails(testClassName: string, testCaseName: string) {
    // TODO escape
    return `/uploads/failure?test_class_name=${testClassName}&test_case_name=${testCaseName}`
  }
}
