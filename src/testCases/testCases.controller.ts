import {Controller, Get, Param, Render} from "@nestjs/common"
import {TestCaseViewModel} from "./testCase.viewModel"
import {TestCasesService} from "./testCases.service"

@Controller('test_cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get(':id')
  @Render('testCases/details')
  async failureDetails(@Param() params): Promise<{viewModel: TestCaseViewModel}> {
    const testCase = await this.testCasesService.find(params.id)

    return {viewModel: new TestCaseViewModel(testCase)}
  }
}
