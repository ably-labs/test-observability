import pluralize from 'pluralize';
import { Repo } from 'src/repos/repo';
import { UploadsFilter } from 'src/uploads/uploads.service';
import { FilterDescriptionViewModel } from '../view/filterDescription';
import { FilterFormViewModel } from '../view/filterForm';
import { ViewModelURLHelpers } from './urlHelpers';
import { InputViewModel } from '../view/input';

export class ViewModelHelpers {
  static formatPercentage(amount: number, total: number): string | null {
    if (total == 0) {
      return null;
    }

    return `${((100 * amount) / total).toFixed(1)}%`;
  }

  static formatPercentageAsCountSuffix(amount: number, total: number): string {
    const formattedPercentage = this.formatPercentage(amount, total);

    if (formattedPercentage === null) {
      return '';
    }

    return ` (${formattedPercentage})`;
  }

  static viewModelForFilter(
    repo: Repo,
    filter: UploadsFilter,
    options: {
      displayOverviewLink: boolean;
      displayFilterLink: boolean;
      fullSentenceSummary: boolean;
    },
  ): FilterDescriptionViewModel {
    return {
      summary: this.summaryForFilter(repo, filter, options),
      overviewLink: options.displayOverviewLink
        ? {
            text: 'overview',
            href: ViewModelURLHelpers.hrefForUploads(repo, filter),
          }
        : null,
      filterLink: options.displayFilterLink
        ? {
            text: 'Filter results',
            href: ViewModelURLHelpers.hrefForFilterOptions(repo, filter),
          }
        : null,
    };
  }

  private static summaryForFilter(
    repo: Repo,
    filter: UploadsFilter,
    options: { fullSentenceSummary: boolean },
  ) {
    const uploadsComponents: string[] = [];
    const failuresComponents: string[] = [];

    uploadsComponents.push(`belonging to the ${repo.owner}/${repo.name} repo`);

    if (filter.branches.length > 0) {
      uploadsComponents.push(
        `from ${pluralize(
          'branch',
          filter.branches.length,
        )} ${filter.branches.join(', ')}`,
      );
    }

    if (filter.createdBefore !== null) {
      uploadsComponents.push(
        `which were uploaded before ${filter.createdBefore.toISOString()}`,
      );
    }

    if (filter.createdAfter !== null) {
      uploadsComponents.push(
        `which were uploaded after ${filter.createdAfter.toISOString()}`,
      );
    }

    if (filter.failureMessage !== null) {
      failuresComponents.push(
        `whose message contains (case-insensitive) "${filter.failureMessage}"`,
      );
    }

    if (uploadsComponents.length == 0 && failuresComponents.length == 0) {
      return '';
    }

    const uploadsDescription =
      uploadsComponents.length > 0
        ? `uploads ${uploadsComponents.join(' and ')}`
        : null;
    const failuresDescription =
      failuresComponents.length > 0
        ? `test failures ${failuresComponents.join(' and ')}`
        : null;

    return `${
      options.fullSentenceSummary ? 'You are currently only viewing ' : ''
    }${[uploadsDescription, failuresDescription]
      .filter((val) => val !== null)
      .join(', and ')}${options.fullSentenceSummary ? '.' : ''}`;
  }

  static formViewModelForFilter(
    filter: UploadsFilter | null,
    availableBranches: string[],
    paramNamePrefix: string,
    options: Pick<FilterFormViewModel, 'formAction' | 'submitButton'>,
  ): FilterFormViewModel {
    return {
      hiddenFields: [],
      ...options,
      branchOptions: {
        idPrefix: 'branches',
        name: `${paramNamePrefix}branches[]`,
        checkboxes: availableBranches.map((branch) => ({
          label: branch,
          value: branch,
          checked: filter?.branches.includes(branch) ?? false,
        })),
      },

      createdBefore: {
        name: `${paramNamePrefix}createdBefore`,
        value: filter?.createdBefore?.toISOString() ?? '',
      },

      createdAfter: {
        name: `${paramNamePrefix}createdAfter`,
        value: filter?.createdAfter?.toISOString() ?? '',
      },

      failureMessage: {
        name: `${paramNamePrefix}failureMessage`,
        value: filter?.failureMessage ?? '',
      },
    };
  }

  static hiddenFieldsForFilter(
    filter: UploadsFilter,
    paramNamePrefix: string,
  ): InputViewModel[] {
    return ViewModelURLHelpers.queryComponentsForFilter(filter, {
      paramPrefix: paramNamePrefix,
    }).map((component) => ({ name: component.key, value: component.value }));
  }
}
