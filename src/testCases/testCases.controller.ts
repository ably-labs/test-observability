import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { ControllerUtils } from 'src/utils/controller/utils';
import { TestCaseViewModel } from './testCase.viewModel';
import { TestCasesService } from './testCases.service';

@Controller('test_cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get(':id')
  @Render('testCases/details')
  async failureDetails(
    @Param() params: any,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: TestCaseViewModel }> {
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );
    const testCase = await this.testCasesService.find(params.id, filter);

    return { viewModel: new TestCaseViewModel(testCase, filter) };
  }
}
