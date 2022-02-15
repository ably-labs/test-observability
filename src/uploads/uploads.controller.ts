import {Controller, Get, Post, Headers, Body, Render, Param, Query, Header, Res} from '@nestjs/common';
import {ReportDetailsViewModel} from './details.viewModel';
import {FailureDetailsViewModel} from './failureDetails.viewModel';
import {JUnitReport} from './junitReport';
import {MultiReport} from './multiReport';
import {OverviewViewModel} from './overview.viewModel';
import {UploadsService} from './uploads.service';
import {Response} from 'express'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  private async createMultiReport(): Promise<MultiReport> {
    const uploads = await this.uploadsService.findAll()
    const reportPromises = uploads.map(upload => JUnitReport.createFromUpload(upload).then(junitReport => ({junitReport, upload})))
    const reports = await Promise.all(reportPromises)

    return new MultiReport(reports)
  }

  @Get()
  @Render('uploads/overview')
  async overview(): Promise<{viewModel: OverviewViewModel}> {
    const multiReport = await this.createMultiReport()
    const viewModel = new OverviewViewModel(multiReport)
    return {viewModel}
  }

  // TODO move to another controller (with a better URL) and service once I understand Nest.js better
  @Get('failure')
  @Render('uploads/failure')
  async failureDetails(@Query() query): Promise<{viewModel: FailureDetailsViewModel}> {
    const multiReport = await this.createMultiReport()

    const testClassName = query.test_class_name
    const testCaseName = query.test_case_name

    return {viewModel: new FailureDetailsViewModel(multiReport, testClassName, testCaseName)}
  }

  @Get(':id/junit_report_xml')
  @Header('Content-Type', 'text/xml')
  async junitReportXml(@Param() params, @Res({passthrough: true}) res: Response): Promise<string> {
    const upload = await this.uploadsService.find(params.id)
    res.header('Content-Disposition', `inline; filename="junit_report_${upload.id}.xml"`)
    return upload.junitReportXml
  }

  @Get(':id')
  @Render('uploads/details')
  async details(@Param() params): Promise<{viewModel: ReportDetailsViewModel}> {
    const upload = await this.uploadsService.find(params.id)
    const junitReport = await JUnitReport.createFromUpload(upload)

    const viewModel = new ReportDetailsViewModel({upload, junitReport})
    return {viewModel}
  }

  @Post()
  async create(@Headers("Test-Observability-Secret") secret: string, @Headers("Content-Type") contentType: string, @Body('junit_report_xml') junitReportXmlBase64: string, @Body('github_sha') githubSha: string, @Body('github_ref_name') githubRefName: string, @Body('github_retention_days') githubRetentionDays: number, @Body('github_action') githubAction: string, @Body('github_run_number') githubRunNumber: number, @Body('github_run_attempt') githubRunAttempt: number, @Body('github_run_id') githubRunId: string, @Body('github_base_ref') githubBaseRef: string, @Body('github_head_ref') githubHeadRef: string, @Body('github_job') githubJob: string, @Body('iteration') iteration: number): Promise<{id: string}> {
    if (contentType !== "application/json") {
      throw new Error("Expected Content-Type of body to be application/json.")
    }

    if (secret !== process.env.TEST_OBSERVABILITY_SECRET) {
      throw new Error("Incorrect value provided in Test-Observability-Secret header.")
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString('utf8')

    const upload = await this.uploadsService.create({
      junitReportXml, githubSha, githubRefName, githubRetentionDays, githubAction, githubRunNumber, githubRunAttempt, githubRunId, githubBaseRef, githubHeadRef, githubJob, iteration
    })
    return {id: upload.id}
  }
}
