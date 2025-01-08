import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { UploadsFilter } from './uploads.service';

export class FilterViewModel {
  constructor(
    private readonly filter: UploadsFilter,
    private readonly availableBranches: string[],
    private readonly formAction: string,
  ) {}

  readonly form = ViewModelHelpers.formViewModelForFilter(
    this.filter,
    this.availableBranches,
    '',
    {
      formAction: this.formAction,
      submitButton: { text: 'Apply filter' },
    },
  );
}
