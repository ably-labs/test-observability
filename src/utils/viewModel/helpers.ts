import pluralize from 'pluralize';
import { UploadsFilter } from 'src/uploads/uploads.service';
import { FilterDescriptionViewModel } from '../view/filterDescription';
import { ViewModelURLHelpers } from './urlHelpers';

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

  static viewModelForFilter(filter: UploadsFilter): FilterDescriptionViewModel {
    return {
      summary: this.summaryForFilter(filter),
      filterLink: {
        text: 'Filter results',
        href: ViewModelURLHelpers.hrefForFilterOptions(filter),
      },
    };
  }

  private static summaryForFilter(filter: UploadsFilter) {
    const uploadsComponents: string[] = [];
    const failuresComponents: string[] = [];

    uploadsComponents.push(`belonging to the ${filter.owner}/${filter.repo} repo`);

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

    return `You are currently only viewing ${[
      uploadsDescription,
      failuresDescription,
    ]
      .filter((val) => val !== null)
      .join(', and ')}.`;
  }
}
