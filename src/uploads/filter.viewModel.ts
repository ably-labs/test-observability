import { Repo } from 'src/repos/repo';
import { CheckboxesViewModel } from 'src/utils/view/checkboxes';
import { InputViewModel } from 'src/utils/view/input';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';
import { UploadsFilter } from './uploads.service';

export class FilterViewModel {
  readonly formAction = ViewModelURLHelpers.hrefForUploads(this.repo);

  constructor(
    private readonly repo: Repo,
    private readonly filter: UploadsFilter,
    private readonly availableBranches: string[],
  ) {}

  branchOptions: CheckboxesViewModel = {
    idPrefix: 'branches',
    name: 'branches[]',
    checkboxes: this.availableBranches.map((branch) => ({
      label: branch,
      value: branch,
      checked: this.filter.branches.includes(branch) ?? false,
    })),
  };

  createdBefore: InputViewModel = {
    value: this.filter.createdBefore?.toISOString() ?? '',
  };

  createdAfter: InputViewModel = {
    value: this.filter.createdAfter?.toISOString() ?? '',
  };

  failureMessage: InputViewModel = {
    value: this.filter.failureMessage ?? '',
  };
}
