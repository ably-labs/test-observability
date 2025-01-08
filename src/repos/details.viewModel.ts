import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { Repo } from './repo';
import { URLHelpers } from 'src/utils/urlHelpers';

export class RepoDetailsViewModel {
  constructor(private readonly repo: Repo) {}

  readonly title = ViewModelHelpers.descriptionForRepo(this.repo);
  readonly uploadsHref = URLHelpers.hrefForUploads(this.repo, null);
}
