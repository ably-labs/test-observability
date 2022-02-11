interface TextTableItemViewModel {
  type: 'text'
  text: string
}

interface LinkTableItemViewModel {
  type: 'link'
  text: string
  href: string
}

type TableItemViewModel = TextTableItemViewModel | LinkTableItemViewModel

type TableRowsViewModel = TableItemViewModel[][]

export interface TableViewModel {
  headers: string[]
  rows: TableRowsViewModel
}
