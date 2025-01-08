import {
  Controller,
  Get,
  Headers,
  Render,
  Param,
  Query,
  Header,
  Res,
} from '@nestjs/common';
import { UploadDetailsViewModel } from './details.viewModel';
import { CommonFailuresSortOrder, ReportsService } from './reports.service';
import { UploadsIndexViewModel } from './index.viewModel';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
import { FilterViewModel } from './filter.viewModel';
import { ControllerUtils } from 'src/utils/controller/utils';
import { ChooseFilterForComparisonViewModel } from './chooseFilterForComparison.viewModel';
import { CompareViewModel } from './compare.viewModel';
import { URLHelpers } from 'src/utils/urlHelpers';

@Controller('repos/:owner/:name/uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @Render('uploads/index')
  async index(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
  ): Promise<{ viewModel: UploadsIndexViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
      onlyFailuresWithCrashReports,
    );
    const uploadsReport = await this.reportsService.createUploadsReport(
      repo,
      filter,
    );

    const viewModel = new UploadsIndexViewModel(repo, uploadsReport, filter);
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
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
  ): Promise<{ viewModel: FilterViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
      onlyFailuresWithCrashReports,
    );
    const seenBranchNames = await this.reportsService.fetchSeenBranchNames(
      repo,
    );
    const viewModel = new FilterViewModel(
      filter,
      seenBranchNames,
      URLHelpers.hrefForUploads(repo, null),
    );
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
    @Query('base-onlyFailuresWithCrashReports')
    baseOnlyFailuresWithCrashReports: string | undefined,
    @Query('alternative-branches') alternativeBranches: string[] | undefined,
    @Query('alternative-createdBefore')
    alternativeCreatedBefore: string | undefined,
    @Query('alternative-createdAfter')
    alternativeCreatedAfter: string | undefined,
    @Query('alternative-failureMessage')
    alternativeFailureMessage: string | undefined,
    @Query('alternative-onlyFailuresWithCrashReports')
    alternativeOnlyFailuresWithCrashReports: string | undefined,
    @Query('common-failures-order')
    commonFailuresSortOrder: CommonFailuresSortOrder | undefined,
  ): Promise<{ viewModel: CompareViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);

    const baseFilter = ControllerUtils.createFilterFromQuery(
      baseBranches,
      baseCreatedBefore,
      baseCreatedAfter,
      baseFailureMessage,
      baseOnlyFailuresWithCrashReports,
    );

    const alternativeFilter = ControllerUtils.createFilterFromQuery(
      alternativeBranches,
      alternativeCreatedBefore,
      alternativeCreatedAfter,
      alternativeFailureMessage,
      alternativeOnlyFailuresWithCrashReports,
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
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
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
      onlyFailuresWithCrashReports,
    );

    if (accept === 'application/json') {
      res.header('Content-Type', 'application/json');
      res.json(upload);
    } else {
      const viewModel = new UploadDetailsViewModel(upload, repo, filter);
      res.render('uploads/details', { viewModel });
    }
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
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
  ): Promise<{
    viewModel: ChooseFilterForComparisonViewModel;
  }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
      onlyFailuresWithCrashReports,
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
