import { Repo } from 'src/repos/repo';
import { UploadsFilter } from 'src/uploads/uploads.service';

function repoSlug(repo: Repo): string {
  return encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.name);
}

export class ViewModelURLHelpers {
  static repoToUploads(repo: string) {
    return `/repos/${this.encodeRepoName(repo)}/uploads`;
  }

  static hrefForUploads(repo: Repo) {
    return `/repos/${repoSlug(repo)}/uploads`;
  }

  static hrefForUploadDetails(id: string, repo: Repo) {
    return `/repos/${repoSlug(repo)}/uploads/${encodeURIComponent(id)}`;
  }

  static hrefForTestCase(id: string, repo: Repo, filter: UploadsFilter) {
    return this.hrefWithFilter(
      `/repos/${repoSlug(repo)}/test_cases/${encodeURIComponent(id)}`,
      filter,
    );
  }

  private static encodeRepoName(repoName: string) {
    return repoName.split('/').map(encodeURIComponent).join('/');
  }

  static hrefForGitHubRepository(repoName: string) {
    return `https://github.com/${this.encodeRepoName(repoName)}`;
  }

  static hrefForGitHubCommit(repoName: string, sha: string) {
    return `https://github.com/${this.encodeRepoName(
      repoName,
    )}/commit/${encodeURIComponent(sha)}`;
  }

  static hrefForGitHubRunId(repoName: string, runId: string) {
    return `https://github.com/${this.encodeRepoName(
      repoName,
    )}/actions/runs/${runId}`;
  }

  static hrefForGitHubRunAttempt(
    repoName: string,
    runId: string,
    runAttempt: number,
  ) {
    return `https://github.com/${this.encodeRepoName(
      repoName,
    )}/actions/runs/${runId}/attempts/${runAttempt}`;
  }

  static hrefForJunitReportXml(id: string, repo: Repo) {
    return `/repos/${repoSlug(repo)}/uploads/${id}/junit_report_xml`;
  }

  static hrefForFailure(id: string, repo: Repo) {
    return `/repos/${repoSlug(repo)}/failures/${encodeURIComponent(id)}`;
  }

  static queryFragmentForFilter(filter: UploadsFilter): string {
    const components: { key: string; value: string }[] = [];

    filter.branches.forEach((branchName) => {
      components.push({ key: 'branches[]', value: branchName });
    });

    if (filter.createdBefore !== null) {
      components.push({
        key: 'createdBefore',
        value: filter.createdBefore.toISOString(),
      });
    }

    if (filter.createdAfter !== null) {
      components.push({
        key: 'createdAfter',
        value: filter.createdAfter.toISOString(),
      });
    }

    if (filter.failureMessage !== null) {
      components.push({ key: 'failureMessage', value: filter.failureMessage });
    }

    return components
      .map(
        (component) =>
          `${encodeURIComponent(component.key)}=${encodeURIComponent(
            component.value,
          )}`,
      )
      .join('&');
  }

  static hrefWithFilter(href: string, filter: UploadsFilter) {
    const query = this.queryFragmentForFilter(filter);

    if (query) {
      return `${href}?${query}`;
    } else {
      return `${href}`;
    }
  }

  static hrefForFilterOptions(repo: Repo, filter: UploadsFilter) {
    return this.hrefWithFilter(
      `/repos/${repoSlug(repo)}/uploads/filter`,
      filter,
    );
  }
}
