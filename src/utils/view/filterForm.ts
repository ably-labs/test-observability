import { CheckboxesViewModel } from './checkboxes';
import { InputViewModel } from './input';

export interface FilterFormViewModel {
  formAction: string;
  submitButton: {
    text: string;
  };

  hiddenFields: InputViewModel[];

  branchOptions: CheckboxesViewModel;
  createdBefore: InputViewModel;
  createdAfter: InputViewModel;
  failureMessage: InputViewModel;
  onlyFailuresWithCrashReports: CheckboxesViewModel;
}
