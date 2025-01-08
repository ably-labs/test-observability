import { URLHelpers } from 'src/utils/urlHelpers';

interface RepoViewModel {
  title: string;
  href: string;
}

export class ReposViewModel {
  readonly repos: RepoViewModel[];

  constructor(repoStrs: string[]) {
    this.repos = repoStrs.map((repo) => ({
      title: repo,
      href: URLHelpers.hrefForRepo(repo),
    }));
  }
}
