import pluralize from 'pluralize';
import { TableViewModel } from '../utils/view/table';
import { UploadsReport, FailuresOverviewReport } from './reports.service';
import { UploadsFilter } from './uploads.service';
import { ViewModelHelpers } from '../utils/viewModel/helpers';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';

export class OverviewViewModel {
  constructor(
    private readonly uploadsReport: UploadsReport,
    private readonly failuresOverviewReport: FailuresOverviewReport,
    private readonly filter: UploadsFilter,
  ) {}

  readonly filterDescription = ViewModelHelpers.viewModelForFilter(this.filter);

  private readonly numberOfUploadsWithFailures = this.uploadsReport.filter(
    (upload) => upload.numberOfFailures > 0,
  ).length;

  readonly table: TableViewModel = {
    headers: [
      'Upload ID',
      'Uploaded at',
      'Branch',
      'Iteration',
      'Total number of tests',
      'Number of failures',
    ],

    rows: this.uploadsReport.map((entry) => {
      return [
        {
          type: 'link',
          text: entry.upload.id,
          href: ViewModelURLHelpers.hrefForUploadDetails(
            entry.upload.id,
            this.filter,
          ),
        },
        { type: 'text', text: entry.upload.createdAt.toISOString() },
        {
          type: 'text',
          text: entry.upload.githubHeadRef ?? entry.upload.githubRefName ?? '',
        },
        { type: 'text', text: String(entry.upload.iteration) },
        { type: 'text', text: String(entry.numberOfTests) },
        { type: 'text', text: String(entry.numberOfFailures) },
      ];
    }),
  };

  readonly tableIntroText =
    `There ${this.table.rows.length == 1 ? 'is' : 'are'} ${
      this.table.rows.length
    } ${pluralize('upload', this.table.rows.length)}.` +
    (this.table.rows.length == 0
      ? ''
      : ` ${this.numberOfUploadsWithFailures} of them${
          this.numberOfUploadsWithFailures == 0
            ? ''
            : ViewModelHelpers.formatPercentageAsCountSuffix(
                this.numberOfUploadsWithFailures,
                this.table.rows.length,
              )
        } ${
          this.numberOfUploadsWithFailures == 1 ? 'has' : 'have'
        } at least one failed test.`);

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
      'Percentage of total failures',
      'Cumulative percentage of total failures',
      'Last seen',
    ],
    rows: this.failuresOverviewReport.map((entry, index) => [
      { type: 'text', text: String(index + 1) },
      {
        type: 'link',
        text: entry.testCase.id,
        href: ViewModelURLHelpers.hrefForTestCase(
          entry.testCase.id,
          this.filter,
        ),
      },
      { type: 'text', text: entry.testCase.testClassName },
      { type: 'text', text: entry.testCase.testCaseName },
      { type: 'text', text: String(entry.occurrenceCount) },
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
              .slice(0, index + 1)
              .reduce((a, b) => a + b, 0),
            this.totalFailures,
          ) ?? ''
        }`,
      },
      {
        type: 'link',
        text: entry.lastSeenIn.createdAt.toISOString(),
        href: ViewModelURLHelpers.hrefForUploadDetails(
          entry.lastSeenIn.id,
          this.filter,
        ),
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
