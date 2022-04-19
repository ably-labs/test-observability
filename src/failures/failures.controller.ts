import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { ControllerUtils } from 'src/utils/controller/utils';
import { FailureViewModel } from './failure.viewModel';
import { FailuresService } from './failures.service';

@Controller('repos/:owner/:name/failures')
export class FailuresController {
  constructor(private readonly failuresService: FailuresService) {}

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
  ): Promise<{ viewModel: FailureViewModel }> {
    const failure = await this.failuresService.find(id);

    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const filter = ControllerUtils.createFilterFromQuery(
      branches,
      createdBefore,
      createdAfter,
      failureMessage,
    );

    return { viewModel: new FailureViewModel(repo, failure, filter) };
  }
}
