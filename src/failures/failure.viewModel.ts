import {DescriptionListViewModel} from "../utils/view/descriptionList";
import {Failure} from "../uploads/failure.entity";
import {ViewModelURLHelpers} from "src/utils/viewModel/urlHelpers";

export class FailureViewModel {
  constructor(private readonly failure: Failure) {}

  readonly title = `Details of failure ${this.failure.id}`

  readonly metadataDescriptionList: DescriptionListViewModel = {
    items: [
      {
        term: "Upload ID",
        description: {type: "link", text: this.failure.uploadId, href: ViewModelURLHelpers.hrefForUploadDetails(this.failure.uploadId)}
      },
      {
        term: "Test case ID",
        description: {type: "link", text: this.failure.testCase.id, href: ViewModelURLHelpers.hrefForTestCase(this.failure.testCase.id)}
      },
      {
        term: "Message",
        description: {type: "text", text: this.failure.message}
      }
    ]
  }
}
