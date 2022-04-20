import { Repo } from 'src/repos/repo';
import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';
import { UploadsFilter } from './uploads.service';

export class ChooseFilterForComparisonViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly baseFilter: UploadsFilter,
    private readonly availableBranches: string[],
  ) {}

  readonly form = {
    ...ViewModelHelpers.formViewModelForFilter(
      {
        branches: [],
        createdBefore: null,
        createdAfter: null,
        failureMessage: null,
      },
      this.availableBranches,
      'alternative-',
      {
        formAction: ViewModelURLHelpers.hrefForCompare(
          this.repo,
          null,
          null,
          null,
        ),
        submitButton: { text: 'Compare uploads' },
      },
    ),
    hiddenFields: ViewModelHelpers.hiddenFieldsForFilter(
      this.baseFilter,
      'base-',
    ),
  };
}
