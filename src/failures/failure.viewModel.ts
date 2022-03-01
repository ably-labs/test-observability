import {DescriptionListViewModel} from "../utils/view/descriptionList";
import {Failure} from "../uploads/failure.entity";

export class FailureViewModel {
  constructor(private readonly failure: Failure) {}

  readonly title = `Details of failure ${this.failure.id}`

  readonly metadataDescriptionList: DescriptionListViewModel = {
    items: [
      {
        term: "Upload ID",
        description: {type: "link", text: this.failure.uploadId, href: this.hrefForUploadDetails(this.failure.uploadId)}
      },
      {
        term: "Test case ID",
        description: {type: "link", text: this.failure.testCase.id, href: this.hrefForTestCase(this.failure.testCase.id)}
      },
      {
        term: "Message",
        description: {type: "text", text: this.failure.message}
      }
    ]
  }

  // TODO DRY up with overview view model
  private hrefForUploadDetails(id: string) {
    return `/uploads/${id}`
  }

  // TODO DRY up with overview view model
  private hrefForTestCase(id: string) {
    // TODO escape
    return `/test_cases/${id}`
  }
}
