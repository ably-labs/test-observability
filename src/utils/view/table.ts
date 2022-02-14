import {DataItemViewModel} from "./dataItem";

type TableRowsViewModel = DataItemViewModel[][]

export interface TableViewModel {
  headers: string[]
  rows: TableRowsViewModel
}
