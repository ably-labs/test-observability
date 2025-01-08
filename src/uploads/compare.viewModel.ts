import { UploadsFilter } from './uploads.service';
import { ViewModelHelpers } from '../utils/viewModel/helpers';
import {
  CommonFailuresReport,
  CommonFailuresSortOrder,
  ComparisonReport,
  FailuresOverviewReport,
  UploadsReport,
} from './reports.service';
import { TableViewModel } from 'src/utils/view/table';
import { URLHelpers } from 'src/utils/urlHelpers';
import { Repo } from 'src/repos/repo';

export class CompareViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly baseFilter: UploadsFilter,
    private readonly alternativeFilter: UploadsFilter,
    private readonly comparisonReport: ComparisonReport,
  ) {}

  readonly baseFilterDescription = ViewModelHelpers.viewModelForFilter(
    this.repo,
    this.baseFilter,
    {
      displayOverviewLink: true,
      displayFilterLink: false,
      fullSentenceSummary: false,
    },
  );
  readonly alternativeFilterDescription = ViewModelHelpers.viewModelForFilter(
    this.repo,
    this.alternativeFilter,
    {
      displayOverviewLink: true,
      displayFilterLink: false,
      fullSentenceSummary: false,
    },
  );

  private static numberOfUploadsWithFailures(report: UploadsReport) {
    return report.filter((upload) => upload.numberOfFailures > 0).length;
  }

  private static formatNumberOfFailures(report: UploadsReport) {
    const numberOfUploadsWithFailures =
      this.numberOfUploadsWithFailures(report);
    return `${numberOfUploadsWithFailures}${
      numberOfUploadsWithFailures == 0
        ? ''
        : ViewModelHelpers.formatPercentageAsCountSuffix(
            numberOfUploadsWithFailures,
            report.length,
          )
    }`;
  }

  readonly overviewTable: TableViewModel = {
    // TODO we'd like row headers too, but this’ll do
    headers: ['', 'Base', 'Alternative'],
    rows: [
      [
        { type: 'text', text: 'Number of uploads' },
        {
          type: 'text',
          text: String(this.comparisonReport.base.uploadsReport.length),
        },
        {
          type: 'text',
          text: String(this.comparisonReport.alternative.uploadsReport.length),
        },
      ],
      [
        {
          type: 'text',
          text: 'Number of uploads with at least one failed test',
        },
        {
          type: 'text',
          text: CompareViewModel.formatNumberOfFailures(
            this.comparisonReport.base.uploadsReport,
          ),
        },
        {
          type: 'text',
          text: CompareViewModel.formatNumberOfFailures(
            this.comparisonReport.alternative.uploadsReport,
          ),
        },
      ],
    ],
  };

  private static createCommonFailuresTable(
    report: CommonFailuresReport,
    repo: Repo,
    filter: UploadsFilter,
  ): TableViewModel {
    return {
      headers: [
        'Position (base)',
        'Position (alternative)',
        'Test case ID',
        'Test class',
        'Test case',
        'Number of occurrences (base)',
        'Number of occurrences (alternative)',
        'Last seen (base)',
        'Last seen (alternative)',
      ],
      rows: report.entries.map((entry) => [
        { type: 'text', text: String(entry.base.position + 1) },
        { type: 'text', text: String(entry.alternative.position + 1) },
        {
          type: 'link',
          text: entry.testCase.id,
          href: URLHelpers.hrefForTestCase(entry.testCase.id, repo, filter),
        },
        { type: 'text', text: entry.testCase.testClassName },
        { type: 'text', text: entry.testCase.testCaseName },
        { type: 'text', text: String(entry.base.occurrenceCount) },
        { type: 'text', text: String(entry.alternative.occurrenceCount) },
        {
          type: 'link',
          text: entry.base.lastSeenIn.createdAt.toISOString(),
          href: URLHelpers.hrefForUploadDetails(entry.base.lastSeenIn.id, repo),
        },
        {
          type: 'link',
          text: entry.alternative.lastSeenIn.createdAt.toISOString(),
          href: URLHelpers.hrefForUploadDetails(
            entry.alternative.lastSeenIn.id,
            repo,
          ),
        },
      ]),
    };
  }

  private static createFailuresTable(
    report: FailuresOverviewReport,
    repo: Repo,
    filter: UploadsFilter,
    positionDescription: 'base' | 'alternative',
  ): TableViewModel {
    return {
      headers: [
        `Position (${positionDescription})`,
        'Test case ID',
        'Test class',
        'Test case',
        `Number of occurrences (${positionDescription})`,
        `Last seen (${positionDescription})`,
      ],
      rows: report.map((entry) => [
        { type: 'text', text: String(entry.position + 1) },
        {
          type: 'link',
          text: entry.testCase.id,
          href: URLHelpers.hrefForTestCase(entry.testCase.id, repo, filter),
        },
        { type: 'text', text: entry.testCase.testClassName },
        { type: 'text', text: entry.testCase.testCaseName },
        { type: 'text', text: String(entry.occurrenceCount) },
        {
          type: 'link',
          text: entry.lastSeenIn.createdAt.toISOString(),
          href: URLHelpers.hrefForUploadDetails(entry.lastSeenIn.id, repo),
        },
      ]),
    };
  }

  readonly sortOrderDescriptionParagraph = `Currently sorted by ${this.comparisonReport.commonFailures.order} set’s occurrence count.`;

  get switchSortOrderLink() {
    const newOrder: CommonFailuresSortOrder =
      this.comparisonReport.commonFailures.order === 'alternative'
        ? 'base'
        : 'alternative';
    return {
      href: URLHelpers.hrefForCompare(
        this.repo,
        this.baseFilter,
        this.alternativeFilter,
        newOrder,
      ),
      text: `Sort by ${newOrder} set’s occurrence count instead`,
    };
  }

  readonly commonFailuresTable = CompareViewModel.createCommonFailuresTable(
    this.comparisonReport.commonFailures,
    this.repo,
    this.baseFilter,
  );

  readonly failuresIntroducedInAlternativeTable =
    CompareViewModel.createFailuresTable(
      this.comparisonReport.failuresIntroducedInAlternative,
      this.repo,
      this.alternativeFilter,
      'alternative',
    );

  readonly failuresAbsentInAlternativeTable =
    CompareViewModel.createFailuresTable(
      this.comparisonReport.failuresAbsentInAlternative,
      this.repo,
      this.baseFilter,
      'base',
    );
}
