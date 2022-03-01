import {TableViewModel} from "../utils/view/table"
import {UploadsReport, FailuresOverviewReport} from "./reports.service"
import {UploadsFilter} from "./uploads.service"

export class OverviewViewModel {
  constructor(private readonly uploadsReport: UploadsReport, private readonly failuresOverviewReport: FailuresOverviewReport, private readonly filter: UploadsFilter | null) {}

  private readonly numberOfUploadsWithFailures = this.uploadsReport.filter(upload => upload.numberOfFailures > 0).length

  get filterSummary() {
    let uploadsComponents: string[] = []
    let failuresComponents: string[] = []

    if (this.filter == null) {
      return ''
    }

    if (this.filter.branches.length > 0) {
      uploadsComponents.push(`from branch(es) ${this.filter.branches.join(', ')}`)
    }

    if (this.filter.createdBefore !== null) {
      uploadsComponents.push(`which were uploaded before ${this.filter.createdBefore.toISOString()}`)
    }

    if (this.filter.createdAfter !== null) {
      uploadsComponents.push(`which were uploaded after ${this.filter.createdAfter.toISOString()}`)
    }

    if (this.filter.failureMessage !== null) {
      failuresComponents.push(`whose message contains (case-insensitive) "${this.filter.failureMessage}"`)
    }

    if (uploadsComponents.length == 0 && failuresComponents.length == 0) {
      return ''
    }

    let uploadsDescription = uploadsComponents.length > 0 ? `uploads ${uploadsComponents.join(' and ')}` : null
    let failuresDescription = failuresComponents.length > 0 ? `test failures ${failuresComponents.join(' and ')}` : null

    return `You are currently only viewing ${[uploadsDescription, failuresDescription].filter(val => val !== null).join(', and ')}.`
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

  private readonly totalFailures = this.failuresOverviewReport.reduce((accum, val) => accum + val.occurrenceCount, 0)

  readonly failureOccurrencesTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Number of occurrences', 'Percentage of total failures', 'Last seen'],
    rows: this.failuresOverviewReport.map(entry => [
      {type: "text", text: entry.testCase.testClassName},
      {type: "link", text: entry.testCase.testCaseName, href: this.hrefForTestCase(entry.testCase.id)},
      {type: "text", text: String(entry.occurrenceCount)},
      {type: "text", text: `${(100 * entry.occurrenceCount / this.totalFailures).toFixed(1)}%`},
      {type: "link", text: entry.lastSeenIn.createdAt.toISOString(), href: this.hrefForUploadDetails(entry.lastSeenIn.id)}
    ])
  }

  readonly failureOccurrencesTableIntroText = `There are ${this.totalFailures} recorded failures, across ${this.failureOccurrencesTable.rows.length} test cases.`

  private hrefForUploadDetails(id: string) {
    return `/uploads/${id}`
  }

  private hrefForTestCase(id: string) {
    // TODO escape
    return `/test_cases/${id}`
  }
}
