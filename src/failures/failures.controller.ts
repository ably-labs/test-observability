import { Controller, Get, Param, Render } from '@nestjs/common';
import { FailureViewModel } from './failure.viewModel';
import { FailuresService } from './failures.service';

@Controller('failures')
export class FailuresController {
  constructor(private readonly failuresService: FailuresService) {}

  @Get(':id')
  @Render('failures/details')
  async failureDetails(
    @Param() params: any,
  ): Promise<{ viewModel: FailureViewModel }> {
    const failure = await this.failuresService.find(params.id);

    return { viewModel: new FailureViewModel(failure) };
  }
}
