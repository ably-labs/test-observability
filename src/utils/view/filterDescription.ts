export interface FilterDescriptionViewModel {
  summary: string;
  overviewLink: {
    text: string;
    href: string;
  } | null;
  filterLink: {
    text: string;
    href: string;
  } | null;
}
