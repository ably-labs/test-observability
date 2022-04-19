import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ReportsService,
  TestCaseUploadsReport,
} from 'src/uploads/reports.service';
import { ControllerUtils } from 'src/utils/controller/utils';
import { TestCaseViewModel } from './testCase.viewModel';
import { TestCasesService } from './testCases.service';
import { TestCase } from '../uploads/testCase.entity';

@Controller('repos/:owner/:name/test_cases')
export class TestCasesController {
  constructor(
    private readonly testCasesService: TestCasesService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get(':id')
  async failureDetails(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Headers('Accept') accept: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const testCase = await this.testCasesService.find(id, repo, filter);

    if (accept === 'application/json') {
      res.header('Content-Type', 'application/json');
      const strippedTestCase: Omit<TestCase, 'failures'> &
        Partial<Pick<TestCase, 'failures'>> = testCase;
      delete strippedTestCase['failures'];
      res.json(testCase);
    } else {
      const viewModel = new TestCaseViewModel(repo, testCase, filter);
      res.render('testCases/details', { viewModel });
    }
  }

  @Get(':id/uploads')
  async uploads(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<TestCaseUploadsReport> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    const report = await this.reportsService.createTestCaseUploadsReport(
      id,
      repo,
      filter,
    );

    return report;
  }
}
