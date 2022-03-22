import { UploadsFilter } from 'src/uploads/uploads.service';

function repoSlug(filter: UploadsFilter): string {
  return encodeURIComponent(filter.owner) + '/' + encodeURIComponent(filter.repo);
}

export class ViewModelURLHelpers {
  static hrefForUploadDetails(id: string, filter: UploadsFilter) {
    return `/uploads/${repoSlug(filter)}/${encodeURIComponent(id)}`;
  }

  static hrefForTestCase(id: string, filter: UploadsFilter) {
    return this.hrefWithFilter(`/test_cases/${repoSlug(filter)}/${encodeURIComponent(id)}`, filter);
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

  static hrefForJunitReportXml(id: string, filter: UploadsFilter) {
    return `/uploads/${repoSlug(filter)}/${id}/junit_report_xml`;
  }

  static hrefForFailure(id: string, filter: UploadsFilter) {
    return `/failures/${repoSlug(filter)}/${encodeURIComponent(id)}`;
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

  static hrefForFilterOptions(filter: UploadsFilter) {
    return this.hrefWithFilter(`/uploads/${repoSlug(filter)}/filter`, filter);
  }
}
