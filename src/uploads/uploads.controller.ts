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
import { CommonFailuresSortOrder, ReportsService } from './reports.service';
import { OverviewViewModel } from './overview.viewModel';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
import { FilterViewModel } from './filter.viewModel';
import { ControllerUtils } from 'src/utils/controller/utils';
import { ChooseFilterForComparisonViewModel } from './chooseFilterForComparison.viewModel';
import { CompareViewModel } from './compare.viewModel';

@Controller('repos/:owner/:name/uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @Render('uploads/overview')
  async overview(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: OverviewViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const [uploadsReport, failuresOverviewReport] = await Promise.all([
      this.reportsService.createUploadsReport(repo, filter),
      this.reportsService.createFailuresOverviewReport(repo, filter),
    ]);

    const viewModel = new OverviewViewModel(
      repo,
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
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: FilterViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const seenBranchNames = await this.reportsService.fetchSeenBranchNames(
      repo,
    );
    const viewModel = new FilterViewModel(repo, filter, seenBranchNames);
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

  @Get('compare')
  @Render('uploads/compare')
  async compare(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('base-branches') baseBranches: string[] | undefined,
    @Query('base-createdBefore') baseCreatedBefore: string | undefined,
    @Query('base-createdAfter') baseCreatedAfter: string | undefined,
    @Query('base-failureMessage') baseFailureMessage: string | undefined,
    @Query('alternative-branches') alternativeBranches: string[] | undefined,
    @Query('alternative-createdBefore')
    alternativeCreatedBefore: string | undefined,
    @Query('alternative-createdAfter')
    alternativeCreatedAfter: string | undefined,
    @Query('alternative-failureMessage')
    alternativeFailureMessage: string | undefined,
    @Query('common-failures-order')
    commonFailuresSortOrder: CommonFailuresSortOrder | undefined,
  ): Promise<{ viewModel: CompareViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);

    const baseFilter = ControllerUtils.createFilterFromQuery(
      baseBranches,
      baseCreatedBefore,
      baseCreatedAfter,
      baseFailureMessage,
    );

    const alternativeFilter = ControllerUtils.createFilterFromQuery(
      alternativeBranches,
      alternativeCreatedBefore,
      alternativeCreatedAfter,
      alternativeFailureMessage,
    );

    const comparisonReport = await this.reportsService.createComparisonReport(
      repo,
      baseFilter,
      alternativeFilter,
      commonFailuresSortOrder === undefined ? 'base' : commonFailuresSortOrder,
    );

    return {
      viewModel: new CompareViewModel(
        repo,
        baseFilter,
        alternativeFilter,
        comparisonReport,
      ),
    };
  }

  @Get(':id')
  async details(
    @Param('id') id: string,
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Headers('Accept') accept: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.uploadsService.find(id);

    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    if (accept === 'application/json') {
      res.header('Content-Type', 'application/json');
      res.json(upload);
    } else {
      const viewModel = new UploadDetailsViewModel(upload, repo, filter);
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

  @Get('compare/filter')
  @Render('uploads/chooseFilterForComparison')
  async chooseFilterForComparison(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{
    viewModel: ChooseFilterForComparisonViewModel;
  }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    const seenBranchNames = await this.reportsService.fetchSeenBranchNames(
      repo,
    );

    const viewModel = new ChooseFilterForComparisonViewModel(
      repo,
      filter,
      seenBranchNames,
    );

    return { viewModel };
  }
}
