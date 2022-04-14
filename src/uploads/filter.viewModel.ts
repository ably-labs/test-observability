import { Repo } from 'src/repos/repo';
import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';
import { UploadsFilter } from './uploads.service';

export class FilterViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly filter: UploadsFilter,
    private readonly availableBranches: string[],
  ) {}

  readonly form = ViewModelHelpers.formViewModelForFilter(
    this.filter,
    this.availableBranches,
    '',
    {
      formAction: ViewModelURLHelpers.hrefForUploads(this.repo, null),
      submitButton: { text: 'Apply filter' },
    },
  );
}
