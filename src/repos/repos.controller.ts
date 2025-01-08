import { Controller, Get, Render, Param } from '@nestjs/common';
import { ReposViewModel } from './repos.viewModel';
import { ReposService } from './repos.service';
import { ControllerUtils } from 'src/utils/controller/utils';
import { RepoDetailsViewModel } from './details.viewModel';

@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Get()
  @Render('repos/repos')
  async index(): Promise<{ viewModel: ReposViewModel }> {
    const repos = await this.reposService.fetchRepos();
    const viewModel = new ReposViewModel(repos);
    return { viewModel };
  }

  @Get(':owner/:name')
  @Render('repos/details')
  async details(
    @Param('owner') owner: string,
    @Param('name') name: string,
  ): Promise<{ viewModel: RepoDetailsViewModel }> {
    const repo = ControllerUtils.createRepoFromQuery(owner, name);
    const viewModel = new RepoDetailsViewModel(repo);
    return { viewModel };
  }
}
