import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ReportsService,
  TestCaseUploadsReport,
} from 'src/uploads/reports.service';
import { ControllerUtils } from 'src/utils/controller/utils';
import { TestCaseViewModel } from './testCase.viewModel';
import { TestCasesService } from './testCases.service';
import { TestCase } from '../uploads/testCase.entity';

@Controller('repos/:owner/:repo/test_cases')
export class TestCasesController {
  constructor(
    private readonly testCasesService: TestCasesService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get(':id')
  async failureDetails(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
    @Headers('Accept') accept: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const testCase = await this.testCasesService.find(id, filter);

    if (accept === 'application/json') {
      res.header('Content-Type', 'application/json');
      const strippedTestCase: Omit<TestCase, 'failures'> &
        Partial<Pick<TestCase, 'failures'>> = testCase;
      delete strippedTestCase['failures'];
      res.json(testCase);
    } else {
      const viewModel = new TestCaseViewModel(testCase, filter);
      res.render('testCases/details', { viewModel });
    }
  }

  @Get(':id/uploads')
  async uploads(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<TestCaseUploadsReport> {
    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    const report = await this.reportsService.createTestCaseUploadsReport(
      id,
      filter,
    );

    return report;
  }
}
