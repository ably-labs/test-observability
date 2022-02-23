import {Controller, Get, Post, Headers, Body, Render, Param, Query, Header, Res} from '@nestjs/common';
import {UploadDetailsViewModel} from './details.viewModel';
import {ReportsService} from './reports.service';
import {OverviewViewModel} from './overview.viewModel';
import {UploadsFilter, UploadsService} from './uploads.service';
import {Response} from 'express'
import {FilterViewModel} from './filter.viewModel';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService, private readonly reportsService: ReportsService) {}

  private createFilterFromQuery(branches: string[] | undefined): UploadsFilter | null {
    if (branches === undefined) {
      return null
    }

    return {
      branches: branches
    }
  }

  @Get()
  @Render('uploads/overview')
  async overview(@Query('branches') branches: string[] | undefined): Promise<{viewModel: OverviewViewModel}> {
    const filter = this.createFilterFromQuery(branches)
    const [uploadsReport, failuresOverviewReport] = await Promise.all([this.reportsService.createUploadsReport(filter), this.reportsService.createFailuresOverviewReport(filter)])

    const viewModel = new OverviewViewModel(uploadsReport, failuresOverviewReport, filter)
    return {viewModel}
  }

  @Get('filter')
  @Render('uploads/filter')
  async filter(): Promise<{viewModel: FilterViewModel}> {
    const branches = await this.reportsService.fetchSeenBranchNames()
    const viewModel = new FilterViewModel({branches: []}, branches)
    return {viewModel}
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
  async details(@Param() params): Promise<{viewModel: UploadDetailsViewModel}> {
    const upload = await this.uploadsService.find(params.id)

    const viewModel = new UploadDetailsViewModel(upload)
    return {viewModel}
  }

  @Post()
  async create(@Headers("Test-Observability-Auth-Key") authKey: string, @Headers("Content-Type") contentType: string, @Body('junit_report_xml') junitReportXmlBase64: string, @Body('github_sha') githubSha: string, @Body('github_ref_name') githubRefName: string, @Body('github_retention_days') githubRetentionDays: number, @Body('github_action') githubAction: string, @Body('github_run_number') githubRunNumber: number, @Body('github_run_attempt') githubRunAttempt: number, @Body('github_run_id') githubRunId: string, @Body('github_base_ref') githubBaseRef: string, @Body('github_head_ref') githubHeadRef: string, @Body('github_job') githubJob: string, @Body('iteration') iteration: number): Promise<{id: string}> {
    if (contentType !== "application/json") {
      throw new Error("Expected Content-Type of body to be application/json.")
    }

    if (authKey !== process.env.TEST_OBSERVABILITY_AUTH_KEY) {
      throw new Error("Incorrect value provided in Test-Observability-Auth-Key header.")
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString('utf8')

    const upload = await this.uploadsService.create({
      junitReportXml, githubSha, githubRefName, githubRetentionDays, githubAction, githubRunNumber, githubRunAttempt, githubRunId, githubBaseRef, githubHeadRef, githubJob, iteration
    })
    return {id: upload.id}
  }
}
