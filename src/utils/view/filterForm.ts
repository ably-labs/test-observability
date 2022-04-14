import { CheckboxesViewModel } from './checkboxes';
import { InputViewModel } from './input';

export interface FilterFormViewModel {
  formAction: string;
  submitButton: {
    text: string;
  };

  branchOptions: CheckboxesViewModel;
  createdBefore: InputViewModel;
  createdAfter: InputViewModel;
  failureMessage: InputViewModel;
}
