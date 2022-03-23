import { Controller, Get, Render } from '@nestjs/common';
import { ReposViewModel } from './repos.viewModel';
import { ReposService } from './repos.service';

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
}
