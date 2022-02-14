import {DataItemViewModel} from "./dataItem";

interface DescriptionListItem {
  term: string
  description: DataItemViewModel
}

export interface DescriptionListViewModel {
  items: DescriptionListItem[]
}
