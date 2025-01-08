import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';

interface RepoViewModel {
  title: string;
  href: string;
}

export class ReposViewModel {
  readonly repos: RepoViewModel[];

  constructor(repoStrs: string[]) {
    this.repos = repoStrs.map((repo) => ({
      title: repo,
      href: ViewModelURLHelpers.hrefForRepo(repo),
    }));
  }
}
