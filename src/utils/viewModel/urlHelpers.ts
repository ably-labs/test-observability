import { Repo } from 'src/repos/repo';
import { CommonFailuresSortOrder } from 'src/uploads/reports.service';
import { UploadsFilter } from 'src/uploads/uploads.service';

function repoSlug(repo: Repo): string {
  return encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.name);
}

export class ViewModelURLHelpers {
  static repoToUploads(repo: string) {
    return `/repos/${this.encodeRepoName(repo)}/uploads`;
  }

  static hrefForUploads(repo: Repo, filter: UploadsFilter | null) {
    return this.hrefWithFilter(`/repos/${repoSlug(repo)}/uploads`, filter);
  }

  static hrefForUploadDetails(id: string, repo: Repo) {
    return `/repos/${repoSlug(repo)}/uploads/${encodeURIComponent(id)}`;
  }

  static hrefForTestCase(id: string, repo: Repo, filter: UploadsFilter | null) {
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

  static hrefForCrashReportDownload(id: string, repo: Repo) {
    return `/repos/${repoSlug(repo)}/crash_reports/${encodeURIComponent(
      id,
    )}/download`;
  }

  static queryComponentsForFilter(
    filter: UploadsFilter | null,
    { paramPrefix }: { paramPrefix: string | null } = { paramPrefix: null },
  ): { key: string; value: string }[] {
    if (filter == null) {
      return [];
    }

    let components: { key: string; value: string }[] = [];

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

    if (filter.onlyFailuresWithCrashReports) {
      components.push({ key: 'onlyFailuresWithCrashReports', value: 'true' });
    }

    if (paramPrefix !== null) {
      components = components.map((component) => ({
        ...component,
        key: `${paramPrefix}${component.key}`,
      }));
    }

    return components;
  }

  static queryFragmentForFilter(
    filter: UploadsFilter | null,
    { paramPrefix }: { paramPrefix: string | null } = { paramPrefix: null },
  ): string | null {
    return this.queryForComponents(
      this.queryComponentsForFilter(filter, { paramPrefix }),
    );
  }

  static queryForComponents(
    components: { key: string; value: string }[],
  ): string | null {
    if (components.length === 0) {
      return null;
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

  static hrefWithFilter(
    href: string,
    filter: UploadsFilter | null,
    { paramPrefix }: { paramPrefix: string | null } = { paramPrefix: null },
  ) {
    const query = this.queryFragmentForFilter(filter, { paramPrefix });

    if (query) {
      return `${href}?${query}`;
    } else {
      return `${href}`;
    }
  }

  static hrefForFilterOptions(repo: Repo, filter: UploadsFilter | null) {
    return this.hrefWithFilter(
      `/repos/${repoSlug(repo)}/uploads/filter`,
      filter,
    );
  }

  static hrefForChooseFilterForComparison(repo: Repo, filter: UploadsFilter) {
    return this.hrefWithFilter(
      `/repos/${repoSlug(repo)}/uploads/compare/filter`,
      filter,
    );
  }

  static hrefForCompare(
    repo: Repo,
    baseFilter: UploadsFilter | null,
    alternativeFilter: UploadsFilter | null,
    commonFailuresSortOrder: CommonFailuresSortOrder | null,
  ) {
    let components: { key: string; value: string }[] = [];

    components = components.concat(
      this.queryComponentsForFilter(baseFilter, { paramPrefix: 'base-' }),
    );
    components = components.concat(
      this.queryComponentsForFilter(alternativeFilter, {
        paramPrefix: 'alternative-',
      }),
    );
    if (commonFailuresSortOrder !== null) {
      components.push({
        key: 'common-failures-order',
        value: commonFailuresSortOrder,
      });
    }

    return `/repos/${repoSlug(repo)}/uploads/compare?${this.queryForComponents(
      components,
    )}`;
  }
}
