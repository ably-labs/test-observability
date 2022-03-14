interface TextDataItemViewModel {
  type: 'text';
  text: string;
}

interface LinkDataItemViewModel {
  type: 'link';
  text: string;
  href: string;
}

export type DataItemViewModel = TextDataItemViewModel | LinkDataItemViewModel;
