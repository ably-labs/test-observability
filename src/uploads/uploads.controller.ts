import {Controller, Get, Post} from '@nestjs/common';
import {UploadsService} from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  async all(): Promise<string> {
    const uploads = await this.uploadsService.findAll()
    return `There are ${uploads.length} uploads`
  }

  @Post()
  async create(): Promise<{id: string}> {
    // junit_report_xml
    // something GitHubby
    // creation timestamp
    // commit SHA
    // branch name?
    // OS version?
    //
    // GITHUB_REF_NAME - The branch or tag name that triggered the workflow run.
    // GITHUB_RETENTION_DAYS - The number of days that workflow run logs and artifacts are kept. For example, 90.
    // GITHUB_ACTION - The name of the action currently running, or the id of a step. For example, for an action, __repo-owner_name-of-action-repo.
    // GITHUB_RUN_NUMBER - A unique number for each run of a particular workflow in a repository. This number begins at 1 for the workflow's first run, and increments with each new run. This number does not change if you re-run the workflow run. For example, 3.
    // GITHUB_RUN_ID - A unique number for each workflow run within a repository. This number does not change if you re-run the workflow run. For example, 1658821493.
    //

    const upload = await this.uploadsService.create()
    return {id: upload.id}
  }
}
