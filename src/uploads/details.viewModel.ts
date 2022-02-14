import {TableViewModel} from "../utils/view/table";
import {Report} from "./report";

export class ReportDetailsViewModel {
  constructor(private readonly report: Report) {}

  readonly title = `Details of upload ${this.report.upload.id}`

  readonly failuresTable: TableViewModel = {
    headers: ['Test class', 'Test case', 'Message'],
    rows: this.report.junitReport.failures.map(failure => [
      {type: "text", text: failure.testClassName},
      {type: "link", text: failure.testCaseName, href: this.hrefForFailureDetails(failure.testClassName, failure.testCaseName)},
      {type: "text", text: failure.message},
    ])
  }

  // TODO DRY up with overview view model
  private hrefForFailureDetails(testClassName: string, testCaseName: string) {
    // TODO escape
    return `/uploads/failure?test_class_name=${testClassName}&test_case_name=${testCaseName}`
  }
}
