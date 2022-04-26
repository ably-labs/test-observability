import { Controller, Headers, Body, Post } from '@nestjs/common';
import { UploadCreationCrashReport, UploadsService } from './uploads.service';

interface CrashReportDTO {
  filename: string;
  test_class_name: string;
  test_case_name: string;
  data: string; // base64
}

@Controller('uploads')
export class PostUploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  async create(
    @Headers('Test-Observability-Auth-Key') authKey: string,
    @Headers('Content-Type') contentType: string,
    @Body('junit_report_xml') junitReportXmlBase64: string,
    @Body('github_repository') githubRepository: string,
    @Body('github_sha') githubSha: string,
    @Body('github_ref_name') githubRefName: string,
    @Body('github_retention_days') githubRetentionDays: number,
    @Body('github_action') githubAction: string,
    @Body('github_run_number') githubRunNumber: number,
    @Body('github_run_attempt') githubRunAttempt: number,
    @Body('github_run_id') githubRunId: string,
    @Body('github_base_ref') githubBaseRef: string | null,
    @Body('github_head_ref') githubHeadRef: string | null,
    @Body('github_job') githubJob: string,
    @Body('iteration') iteration: number,
    @Body('crash_reports')
    crashReportDtos: CrashReportDTO[] | undefined /* backwards compatibility */,
  ): Promise<{ id: string }> {
    if (contentType !== 'application/json') {
      throw new Error('Expected Content-Type of body to be application/json.');
    }

    if (authKey !== process.env.TEST_OBSERVABILITY_AUTH_KEY) {
      throw new Error(
        'Incorrect value provided in Test-Observability-Auth-Key header.',
      );
    }

    const junitReportXml = Buffer.from(junitReportXmlBase64, 'base64').toString(
      'utf8',
    );

    let crashReports: UploadCreationCrashReport[] | null = null;
    if (crashReportDtos !== undefined) {
      crashReports = crashReportDtos.map((dto) => ({
        filename: dto.filename,
        testCaseName: dto.test_case_name,
        testClassName: dto.test_class_name,
        data: Buffer.from(dto.data, 'base64'),
      }));
    }

    const upload = await this.uploadsService.create(
      {
        junitReportXml,
        githubRepository,
        githubSha,
        githubRefName,
        githubRetentionDays,
        githubAction,
        githubRunNumber,
        githubRunAttempt,
        githubRunId,
        githubBaseRef,
        githubHeadRef,
        githubJob,
        iteration,
      },
      crashReports,
    );
    return { id: upload.id };
  }
}
