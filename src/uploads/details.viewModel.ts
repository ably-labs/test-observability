import {Report} from "./report";

export class ReportDetailsViewModel {
  constructor(private readonly report: Report) {}

  readonly title = `Details of upload ${this.report.upload.id}`
}
