import {Controller, Get, Post, Headers, Body, Render} from '@nestjs/common';
import {JUnitReport} from './junitReport';
import {OverviewViewModel} from './overview.viewModel';
import {UploadsService} from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  @Render('uploads/overview')
  async overview(): Promise<{viewModel: OverviewViewModel}> {
    const uploads = await this.uploadsService.findAll()
    const reportPromises = uploads.map(upload => JUnitReport.createFromUpload(upload).then(junitReport => ({junitReport, upload})))
    const reports = await Promise.all(reportPromises)

    const viewModel = new OverviewViewModel(reports)
    return {viewModel}
  }

  @Post()
  async create(@Headers("Test-Observability-Secret") secret: string, @Headers("Content-Type") contentType: string, @Body('junit_report_xml') junitReportXmlBase64: string, @Body('github_sha') githubSha: string, @Body('github_ref_name') githubRefName: string, @Body('github_retention_days') githubRetentionDays: number, @Body('github_action') githubAction: string, @Body('github_run_number') githubRunNumber: number, @Body('github_run_id') githubRunId: string, @Body('iteration') iteration: number): Promise<{id: string}> {
    if (contentType !== "application/json") {
      throw new Error("Expected Content-Type of body to be application/json.")
    }

    if (secret !== process.env.TEST_OBSERVABILITY_SECRET) {
      throw new Error("Incorrect value provided in Test-Observability-Secret header.")
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString('utf8')

    const upload = await this.uploadsService.create({
      junitReportXml, githubSha, githubRefName, githubRetentionDays, githubAction, githubRunNumber, githubRunId, iteration
    })
    return {id: upload.id}
  }
}
