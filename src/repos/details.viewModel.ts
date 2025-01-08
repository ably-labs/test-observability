import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { Repo } from './repo';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';

export class RepoDetailsViewModel {
  constructor(private readonly repo: Repo) {}

  readonly title = ViewModelHelpers.descriptionForRepo(this.repo);
  readonly uploadsHref = ViewModelURLHelpers.hrefForUploads(this.repo, null);
}
