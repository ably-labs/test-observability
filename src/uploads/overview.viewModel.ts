import {TableViewModel} from "../utils/view/table"
import {UploadsReport, FailuresOverviewReport} from "./reports.service"
import {UploadsFilter} from "./uploads.service"

export class OverviewViewModel {
  constructor(private readonly uploadsReport: UploadsReport, private readonly failuresOverviewReport: FailuresOverviewReport, private readonly filter: UploadsFilter | null) {}

  private readonly numberOfUploadsWithFailures = this.uploadsReport.filter(upload => upload.numberOfFailures > 0).length

  get filterSummary() {
    const branches = this?.filter?.branches

    if (!branches?.length) {
      return ''
    }

    return `You are currently only viewing uploads from branch(es) ${branches.join(', ')}.`
  }

  readonly filterLinkText = this.filter ? "Change filter" : "Filter results"

  readonly table: TableViewModel = {
    headers: [
      'ID',
      'Uploaded at',
      'Pull request head ref',
      'Iteration',
      'Total number of tests',
      'Number of failures',
    ],

    rows: this.uploadsReport.map(entry => {
      return [
        {type: "link", text: entry.upload.id, href: this.hrefForUploadDetails(entry.upload.id)},
        {type: "text", text: entry.upload.createdAt.toISOString()},
        {type: "text", text: entry.upload.githubHeadRef},
        {type: "text", text: String(entry.upload.iteration)},
        {type: "text", text: String(entry.numberOfTests)},
        {type: "text", text: String(entry.numberOfFailures)}
      ]
    })
  }

  readonly tableIntroText = `There are ${this.table.rows.length} uploads. ${this.numberOfUploadsWithFailures} of them (${(100 * this.numberOfUploadsWithFailures / this.table.rows.length).toFixed(1)}%) have at least one failed test.`

  readonly failureOccurrencesTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Number of occurrences', 'Last seen'],
    rows: this.failuresOverviewReport.map(entry => [
      {type: "text", text: entry.testCase.testClassName},
      {type: "link", text: entry.testCase.testCaseName, href: this.hrefForTestCase(entry.testCase.id)},
      {type: "text", text: String(entry.occurrenceCount)},
      {type: "link", text: entry.lastSeenIn.createdAt.toISOString(), href: this.hrefForUploadDetails(entry.lastSeenIn.id)}
    ])
  }

  private hrefForUploadDetails(id: string) {
    return `/uploads/${id}`
  }

  private hrefForTestCase(id: string) {
    // TODO escape
    return `/test_cases/${id}`
  }
}
