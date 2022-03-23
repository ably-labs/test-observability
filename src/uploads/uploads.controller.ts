import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Render,
  Param,
  Query,
  Header,
  Res,
} from '@nestjs/common';
import { UploadDetailsViewModel } from './details.viewModel';
import { ReportsService } from './reports.service';
import { OverviewViewModel } from './overview.viewModel';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
import { FilterViewModel } from './filter.viewModel';
import { ControllerUtils } from 'src/utils/controller/utils';

@Controller('repos/:owner/:repo/uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @Render('uploads/overview')
  async overview(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: OverviewViewModel }> {
    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const [uploadsReport, failuresOverviewReport] = await Promise.all([
      this.reportsService.createUploadsReport(filter),
      this.reportsService.createFailuresOverviewReport(filter),
    ]);

    const viewModel = new OverviewViewModel(
      uploadsReport,
      failuresOverviewReport,
      filter,
    );
    return { viewModel };
  }

  @Get('filter')
  @Render('uploads/filter')
  async filter(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: FilterViewModel }> {
    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const seenBranchNames = await this.reportsService.fetchSeenBranchNames(
      filter,
    );
    const viewModel = new FilterViewModel(filter, seenBranchNames);
    return { viewModel };
  }

  @Get(':id/junit_report_xml')
  @Header('Content-Type', 'text/xml')
  async junitReportXml(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const upload = await this.uploadsService.find(id);
    res.header(
      'Content-Disposition',
      `inline; filename="junit_report_${upload.id}.xml"`,
    );
    return upload.junitReportXml;
  }

  @Get(':id')
  async details(
    @Param('id') id: string,
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Headers('Accept') accept: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.uploadsService.find(id);

    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    if (accept === 'application/json') {
      res.header('Content-Type', 'application/json');
      res.json(upload);
    } else {
      const viewModel = new UploadDetailsViewModel(upload, filter);
      res.render('uploads/details', { viewModel });
    }
  }

  @Post()
  async create(
    @Headers('Test-Observability-Auth-Key') authKey: string,
    @Headers('Content-Type') contentType: string,
    @Body('junit_report_xml') junitReportXmlBase64: string,
    @Body('github_repository') githubRepository: string,
    @Body('github_sha') githubSha: string,
    @Body('github_ref_name') githubRefName: string,
    @Body('github_retention_days') githubRetentionDays: number,
    @Body('github_action') githubAction: string,
    @Body('github_run_number') githubRunNumber: number,
    @Body('github_run_attempt') githubRunAttempt: number,
    @Body('github_run_id') githubRunId: string,
    @Body('github_base_ref') githubBaseRef: string | null,
    @Body('github_head_ref') githubHeadRef: string | null,
    @Body('github_job') githubJob: string,
    @Body('iteration') iteration: number,
  ): Promise<{ id: string }> {
    if (contentType !== 'application/json') {
      throw new Error('Expected Content-Type of body to be application/json.');
    }

    if (authKey !== process.env.TEST_OBSERVABILITY_AUTH_KEY) {
      throw new Error(
        'Incorrect value provided in Test-Observability-Auth-Key header.',
      );
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString(
      'utf8',
    );

    const upload = await this.uploadsService.create({
      junitReportXml,
      githubRepository,
      githubSha,
      githubRefName,
      githubRetentionDays,
      githubAction,
      githubRunNumber,
      githubRunAttempt,
      githubRunId,
      githubBaseRef,
      githubHeadRef,
      githubJob,
      iteration,
    });
    return { id: upload.id };
  }
}
