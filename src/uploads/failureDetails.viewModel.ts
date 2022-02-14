import {TableViewModel} from "src/utils/view/table";
import {MultiReport} from "./multiReport";

export class FailureDetailsViewModel {
  constructor(private readonly multiReport: MultiReport, private readonly testClassName: string, private readonly testCaseName: string) {}

  get heading(): string {
    return `Failures in ${this.testClassName}.${this.testCaseName}`
  }

  readonly occurrencesTable: TableViewModel = {
    headers: ['Upload ID', 'Message'],
    rows: this.multiReport.failuresForTestCase(this.testClassName, this.testCaseName).map(failure => [
      {type: "link", text: failure.upload.id, href: this.hrefForUploadDetails(failure.upload.id)},
      {type: "text", text: failure.message}
    ])
  }

  // TODO DRY up with overview view model
  private hrefForUploadDetails(id: string) {
    return `/uploads/${id}`
  }
}
