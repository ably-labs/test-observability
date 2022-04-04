import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { ControllerUtils } from 'src/utils/controller/utils';
import { FailureViewModel } from './failure.viewModel';
import { FailuresService } from './failures.service';

@Controller('repos/:owner/:repo/failures')
export class FailuresController {
  constructor(private readonly failuresService: FailuresService) {}

  @Get(':id')
  @Render('failures/details')
  async failureDetails(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('id') id: string,
    @Query('branches') branches: string[] | undefined,
    @Query('createdBefore') createdBefore: string | undefined,
    @Query('createdAfter') createdAfter: string | undefined,
    @Query('failureMessage') failureMessage: string | undefined,
  ): Promise<{ viewModel: FailureViewModel }> {
    const failure = await this.failuresService.find(id);

    const filter = ControllerUtils.createFilterFromQuery(
      owner,
      repo,
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    return { viewModel: new FailureViewModel(failure, filter) };
  }
}
