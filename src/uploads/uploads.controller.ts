import {Controller, Get, Post, Headers, Body} from '@nestjs/common';
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
  async create(@Headers("Content-Type") contentType: string, @Body('junit_report_xml') junitReportXmlBase64: string, @Body('github_sha') githubSha: string, @Body('github_ref_name') githubRefName: string, @Body('github_retention_days') githubRetentionDays: number, @Body('github_action') githubAction: string, @Body('github_run_number') githubRunNumber: number, @Body('github_run_id') githubRunId: string, @Body('iteration') iteration: number): Promise<{id: string}> {
    if (contentType !== "application/json") {
      throw new Error("Expected Content-Type of body to be application/json.")
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString('utf8')

    const upload = await this.uploadsService.create({
      junitReportXml, githubSha, githubRefName, githubRetentionDays, githubAction, githubRunNumber, githubRunId, iteration
    })
    return {id: upload.id}
  }
}
