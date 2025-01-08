import pluralize from 'pluralize';
import { TableViewModel } from '../utils/view/table';
import { UploadsReport } from './reports.service';
import { UploadsFilter } from './uploads.service';
import { ViewModelHelpers } from '../utils/viewModel/helpers';
import { URLHelpers } from 'src/utils/urlHelpers';
import { Repo } from 'src/repos/repo';

export class UploadsIndexViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly uploadsReport: UploadsReport,
    private readonly filter: UploadsFilter,
  ) {}

  readonly filterDescription = ViewModelHelpers.viewModelForFilter(
    this.repo,
    this.filter,
    {
      displayOverviewLink: false,
      filterHref: URLHelpers.hrefForUploadsFilterOptions(
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
          href: URLHelpers.hrefForUploadDetails(entry.upload.id, this.repo),
        },
        { type: 'text', text: entry.upload.createdAt.toISOString() },
        {
          type: 'text',
          text: ViewModelHelpers.branchNameForUpload(entry.upload),
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
}
