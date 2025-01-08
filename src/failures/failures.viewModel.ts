import pluralize from 'pluralize';
import { Repo } from 'src/repos/repo';
import {
  FailuresOverviewReport,
  UploadsReport,
} from 'src/uploads/reports.service';
import { UploadsFilter } from 'src/uploads/uploads.service';
import { TableViewModel } from 'src/utils/view/table';
import { ViewModelHelpers } from 'src/utils/viewModel/helpers';
import { URLHelpers } from 'src/utils/urlHelpers';

export class FailuresViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly uploadsReport: UploadsReport,
    private readonly failuresOverviewReport: FailuresOverviewReport,
    private readonly filter: UploadsFilter,
  ) {}

  readonly filterDescription = ViewModelHelpers.viewModelForFilter(
    this.repo,
    this.filter,
    {
      displayOverviewLink: false,
      filterHref: URLHelpers.hrefForFailuresFilterOptions(
        this.repo,
        this.filter,
      ),
      fullSentenceSummary: true,
    },
  );

  readonly compareLink = {
    text: 'Compare with another set of uploads',
    href: URLHelpers.hrefForChooseFilterForComparison(this.repo, this.filter),
  };

  private readonly totalFailures = this.failuresOverviewReport.reduce(
    (accum, val) => accum + val.occurrenceCount,
    0,
  );

  readonly failureOccurrencesTable: TableViewModel = {
    headers: [
      'Position',
      'Test case ID',
      'Test class',
      'Test case',
      'Number of occurrences',
      'Percentage of uploads',
      'Percentage of total failures',
      'Cumulative percentage of total failures',
      'Last seen',
    ],
    rows: this.failuresOverviewReport.map((entry) => [
      { type: 'text', text: String(entry.position + 1) },
      {
        type: 'link',
        text: entry.testCase.id,
        href: URLHelpers.hrefForTestCase(
          entry.testCase.id,
          this.repo,
          this.filter,
        ),
      },
      { type: 'text', text: entry.testCase.testClassName },
      { type: 'text', text: entry.testCase.testCaseName },
      { type: 'text', text: String(entry.occurrenceCount) },
      {
        type: 'text',
        text:
          ViewModelHelpers.formatPercentage(
            entry.occurrenceCount,
            this.uploadsReport.length,
          ) ?? '',
      },
      {
        type: 'text',
        text: `${
          ViewModelHelpers.formatPercentage(
            entry.occurrenceCount,
            this.totalFailures,
          ) ?? ''
        }`,
      },
      {
        type: 'text',
        text: `${
          ViewModelHelpers.formatPercentage(
            this.failuresOverviewReport
              .map((entry) => entry.occurrenceCount)
              .slice(0, entry.position + 1)
              .reduce((a, b) => a + b, 0),
            this.totalFailures,
          ) ?? ''
        }`,
      },
      {
        type: 'link',
        text: entry.lastSeenIn.createdAt.toISOString(),
        href: URLHelpers.hrefForUploadDetails(entry.lastSeenIn.id, this.repo),
      },
    ]),
  };

  readonly failureOccurrencesTableIntroText = `There ${
    this.totalFailures == 1 ? 'is' : 'are'
  } ${this.totalFailures} recorded ${pluralize(
    'failure',
    this.totalFailures,
  )}, across ${this.failureOccurrencesTable.rows.length} ${pluralize(
    'test case',
    this.failureOccurrencesTable.rows.length,
  )}.`;
}
