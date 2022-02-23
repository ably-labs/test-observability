import {CheckboxesViewModel} from "src/utils/view/checkboxes";
import {UploadsFilter} from "./uploads.service";

export class FilterViewModel {
  constructor(private readonly filter: UploadsFilter, private readonly availableBranches: string[]) {}

  branchOptions: CheckboxesViewModel = {
    idPrefix: "branches",
    name: "branches[]",
    checkboxes: this.availableBranches.map(branch => ({
      label: branch,
      value: branch,
      checked: this.filter.branches.includes(branch)
    }))
  }
}
