interface CheckboxViewModel {
  label: string
  value: string
  checked: boolean
}

export interface CheckboxesViewModel {
  idPrefix: string
  name: string
  checkboxes: CheckboxViewModel[]
}
