import {
  Controller,
  Headers,
  Body,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  IsArray,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CrashReportWithoutFailureError,
  UploadCreationCrashReport,
  UploadsService,
} from './uploads.service';

class CreateUploadDTO {
  @IsString()
  junit_report_xml!: string;

  @IsString()
  github_repository!: string;

  @IsString()
  github_sha!: string;

  @IsString()
  github_ref_name!: string;

  @IsNumber()
  @Type(() => Number)
  github_retention_days!: number;

  @IsString()
  github_action!: string;

  @IsNumber()
  @Type(() => Number)
  github_run_number!: number;

  @IsNumber()
  @Type(() => Number)
  github_run_attempt!: number;

  @IsString()
  github_run_id!: string;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsString()
  github_base_ref!: string | null;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsString()
  github_head_ref!: string | null;

  @IsString()
  github_job!: string;

  @ValidateIf((_, value: unknown) => value !== null && value !== undefined)
  @IsString()
  github_job_api_url!: string | null | undefined; /* backwards compatibility */

  @ValidateIf((_, value: unknown) => value !== null && value !== undefined)
  @IsString()
  github_job_html_url!: string | null | undefined; /* backwards compatibility */

  @IsNumber()
  @Type(() => Number)
  iteration!: number;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrashReportDTO)
  crash_reports!: CrashReportDTO[] | undefined; /* backwards compatibility */
}

class CrashReportDTO {
  @IsString()
  filename!: string;

  @IsString()
  test_class_name!: string;

  @IsString()
  test_case_name!: string;

  @IsString()
  data!: string; // base64
}

@Controller('uploads')
export class PostUploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  async create(
    @Headers('Test-Observability-Auth-Key') authKey: string,
    @Headers('Content-Type') contentType: string,
    @Body() body: CreateUploadDTO,
  ): Promise<{ id: string }> {
    if (contentType !== 'application/json') {
      throw new HttpException(
        'Expected Content-Type of body to be application/json.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (authKey !== process.env.TEST_OBSERVABILITY_AUTH_KEY) {
      throw new HttpException(
        'Incorrect value provided in Test-Observability-Auth-Key header.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const junitReportXml = Buffer.from(
      body.junit_report_xml,
      'base64',
    ).toString('utf8');

    let crashReports: UploadCreationCrashReport[] | null = null;
    if (body.crash_reports !== undefined) {
      crashReports = body.crash_reports.map((dto) => ({
        filename: dto.filename,
        testCaseName: dto.test_case_name,
        testClassName: dto.test_class_name,
        data: Buffer.from(dto.data, 'base64'),
      }));
    }

    try {
      const upload = await this.uploadsService.create(
        {
          junitReportXml,
          githubRepository: body.github_repository,
          githubSha: body.github_sha,
          githubRefName: body.github_ref_name,
          githubRetentionDays: body.github_retention_days,
          githubAction: body.github_action,
          githubRunNumber: body.github_run_number,
          githubRunAttempt: body.github_run_attempt,
          githubRunId: body.github_run_id,
          githubBaseRef: body.github_base_ref,
          githubHeadRef: body.github_head_ref,
          githubJob: body.github_job,
          githubJobApiUrl: body.github_job_api_url ?? null,
          githubJobHtmlUrl: body.github_job_html_url ?? null,
          iteration: body.iteration,
        },
        crashReports,
      );

      return { id: upload.id };
    } catch (err) {
      if (err instanceof CrashReportWithoutFailureError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
      throw err;
    }
  }
}
