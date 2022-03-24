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

@Controller('test_cases')
export class TestCasesController {
  constructor(
    private readonly testCasesService: TestCasesService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get(':id')
  async failureDetails(
    @Param() params: any,
    @Headers('Accept') accept: string | undefined,
    @Res() res: Response,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<void> {
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const testCase = await this.testCasesService.find(params.id, filter);

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
    @Param() params: any,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<TestCaseUploadsReport> {
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    const report = await this.reportsService.createTestCaseUploadsReport(
      params.id,
      filter,
    );

    return report;
  }
}
