import {Report} from "./report"

interface TextTableItem {
  type: 'text'
  text: string
}

interface LinkTableItem {
  type: 'link'
  text: string
  href: string
}

type TableItem = TextTableItem | LinkTableItem

export class OverviewViewModel {
  constructor(private readonly reports: Report[]) {}

  readonly tableHeadings = [
    'ID',
    'Uploaded at',
    'Iteration',
    'Total number of tests',
    'Number of failures',
  ]

  readonly tableRows: TableItem[][] = this.reports.map(report => {
    return [
      {type: "link", text: report.upload.id, href: `/uploads/${report.upload.id}`},
      {type: "text", text: String(report.upload.createdAt)},
      {type: "text", text: String(report.upload.iteration)},
      {type: "text", text: String(report.junitReport.numberOfTests)},
      {type: "text", text: String(report.junitReport.numberOfFailures)}
    ]
  })
}
