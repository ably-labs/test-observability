import {TableViewModel} from "../utils/view/table"
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
}
