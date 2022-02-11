import {TableViewModel} from "../utils/view/table"
import {MultiReport} from "./multiReport"
import {Report} from "./report"

export class OverviewViewModel {
  constructor(private readonly reports: Report[]) {}

  readonly table: TableViewModel = {
    headers: [
      'ID',
      'Uploaded at',
      'Iteration',
      'Total number of tests',
      'Number of failures',
    ],

    rows: this.reports.map(report => {
      return [
        {type: "link", text: report.upload.id, href: `/uploads/${report.upload.id}`},
        {type: "text", text: report.upload.createdAt.toISOString()},
        {type: "text", text: String(report.upload.iteration)},
        {type: "text", text: String(report.junitReport.numberOfTests)},
        {type: "text", text: String(report.junitReport.numberOfFailures)}
      ]
    })
  }

  private readonly multiReport = new MultiReport(this.reports)

  readonly failureOccurrencesTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Number of occurrences'],
    rows: this.multiReport.failuresByDescendingOccurrenceOrder.map(failure => [
      {type: "text", text: failure.failure.testClassName},
      {type: "text", text: failure.failure.testCaseName},
      {type: "text", text: String(failure.occurrenceCount)},
    ])
  }
}
