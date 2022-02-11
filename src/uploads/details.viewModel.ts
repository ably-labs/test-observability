import {TableViewModel} from "../utils/view/table";
import {Report} from "./report";

export class ReportDetailsViewModel {
  constructor(private readonly report: Report) {}

  readonly title = `Details of upload ${this.report.upload.id}`

  readonly failuresTable: TableViewModel = {
    headers: ['Test case', 'Message'],
    rows: this.report.junitReport.failures.map(failure => [
      {type: "text", text: failure.testCaseName},
      {type: "text", text: failure.message},
    ])
  }
}
