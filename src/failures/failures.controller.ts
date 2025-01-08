import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { ControllerUtils } from 'src/utils/controller/utils';
import { FailureViewModel } from './failure.viewModel';
import { FailuresService } from './failures.service';
import { ReportsService } from 'src/uploads/reports.service';
import { FailuresViewModel } from './failures.viewModel';
import { FilterViewModel } from 'src/uploads/filter.viewModel';
import { URLHelpers } from 'src/utils/urlHelpers';

@Controller('repos/:owner/:name/failures')
export class FailuresController {
  constructor(
    private readonly failuresService: FailuresService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @Render('failures/failures')
  async index(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
  ): Promise<{ viewModel: FailuresViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
      onlyFailuresWithCrashReports,
    );
    const [uploadsReport, failuresOverviewReport] = await Promise.all([
      this.reportsService.createUploadsReport(repo, filter),
      this.reportsService.createFailuresOverviewReport(repo, filter),
    ]);

    const viewModel = new FailuresViewModel(
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
      URLHelpers.hrefForFailures(repo, null),
    );
    return { viewModel };
  }

  @Get(':id')
  @Render('failures/details')
  async failureDetails(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Query('onlyFailuresWithCrashReports')
    onlyFailuresWithCrashReports: string | undefined,
  ): Promise<{ viewModel: FailureViewModel }> {
    const failure = await this.failuresService.find(id);

    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
      onlyFailuresWithCrashReports,
    );

    return { viewModel: new FailureViewModel(repo, failure, filter) };
  }
}
