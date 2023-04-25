import { DescriptionListViewModel } from '../utils/view/descriptionList';
import { Failure } from '../uploads/failure.entity';
import { ViewModelURLHelpers } from 'src/utils/viewModel/urlHelpers';
import { UploadsFilter } from 'src/uploads/uploads.service';
import { Repo } from 'src/repos/repo';

interface CrashReportViewModel {
  id: string;
  metadataDescriptionList: DescriptionListViewModel;
  report: string;
  downloadHref: string;
}

export class FailureViewModel {
  constructor(
    private readonly repo: Repo,
    private readonly failure: Failure,
    private readonly filter: UploadsFilter,
  ) {}

  readonly title = `Details of failure ${this.failure.id}`;

  readonly metadataDescriptionList: DescriptionListViewModel = {
    items: [
      {
        term: 'Upload ID',
        description: {
          type: 'link',
          text: this.failure.uploadId,
          href: ViewModelURLHelpers.hrefForUploadDetails(
            this.failure.uploadId,
            this.repo,
          ),
        },
      },
      {
        term: 'Test case ID',
        description: {
          type: 'link',
          text: this.failure.testCase.id,
          href: ViewModelURLHelpers.hrefForTestCase(
            this.failure.testCase.id,
            this.repo,
            this.filter,
          ),
        },
      },
      {
        term: 'Message',
        description: { type: 'text', text: this.failure.message },
      },
    ],
  };

  readonly crashReports: CrashReportViewModel[] = this.failure.crashReports.map(
    (crashReport) => ({
      id: crashReport.id,
      originalFilename: crashReport.filename,
      metadataDescriptionList: {
        items: [
          {
            term: 'Original filename',
            description: {
              type: 'text',
              text: crashReport.filename,
            },
          },
        ],
      },
      report: crashReport.data,
      downloadHref: ViewModelURLHelpers.hrefForCrashReportDownload(
        crashReport.id,
        this.repo,
      ),
    }),
  );
}
