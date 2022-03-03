import {UploadsFilter} from "src/uploads/uploads.service"

export class ViewModelURLHelpers {
  static hrefForUploadDetails(id: string) {
    return `/uploads/${encodeURIComponent(id)}`
  }

  static hrefForTestCase(id: string, filter: UploadsFilter | null) {
    return this.hrefWithFilter(`/test_cases/${encodeURIComponent(id)}`, filter)
  }

  private static encodeRepoName(repoName: string) {
    return repoName.split('/').map(encodeURIComponent).join('/')
  }

  static hrefForGitHubRepository(repoName: string) {
    return `https://github.com/${this.encodeRepoName(repoName)}`
  }

  static hrefForGitHubCommit(repoName: string, sha: string) {
    return `https://github.com/${this.encodeRepoName(repoName)}/commit/${encodeURIComponent(sha)}`
  }

  static hrefForGitHubRunId(repoName: string, runId: string) {
    return `https://github.com/${this.encodeRepoName(repoName)}/actions/runs/${runId}`
  }

  static hrefForGitHubRunAttempt(repoName: string, runId: string, runAttempt: number) {
    return `https://github.com/${this.encodeRepoName(repoName)}/actions/runs/${runId}/attempts/${runAttempt}`
  }

  static hrefForJunitReportXml(id: string) {
    return `/uploads/${id}/junit_report_xml`
  }

  static hrefForFailure(id: string) {
    return `/failures/${encodeURIComponent(id)}`
  }

  static queryFragmentForFilter(filter: UploadsFilter): string {
    let components: {key: string, value: string}[] = []

    filter.branches.forEach(branchName => {
      components.push({key: "branches[]", value: branchName})
    })

    if (filter.createdBefore !== null) {
      components.push({key: "createdBefore", value: filter.createdBefore.toISOString()})
    }

    if (filter.createdAfter !== null) {
      components.push({key: "createdAfter", value: filter.createdAfter.toISOString()})
    }

    if (filter.failureMessage !== null) {
      components.push({key: "failureMessage", value: filter.failureMessage})
    }

    return components.map(component => `${encodeURIComponent(component.key)}=${encodeURIComponent(component.value)}`).join('&')
  }

  static hrefWithFilter(href: string, filter: UploadsFilter | null) {
    if (filter == null) {
      return href
    }

    return `${href}?${this.queryFragmentForFilter(filter)}`
  }

  static hrefForFilterOptions(filter: UploadsFilter | null) {
    return this.hrefWithFilter('/uploads/filter', filter)
  }
}
