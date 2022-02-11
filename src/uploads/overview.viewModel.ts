import {Upload} from "./upload.entity";
import {JUnitReport} from "./junitReport";

interface Report {
  upload: Upload
  junitReport: JUnitReport
}

export class OverviewViewModel {
  constructor(private readonly reports: Report[]) {}

  readonly tableHeadings = [
    'Uploaded at',
    'Iteration',
    'Total number of tests',
    'Number of failures',
  ]

  readonly tableRows = this.reports.map(report => {
    return [
      report.upload.createdAt,
      report.upload.iteration,
      report.junitReport.numberOfTests,
      report.junitReport.numberOfFailures
    ]
  })
}
