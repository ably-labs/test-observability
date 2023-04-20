import { Controller, Get, Param, Res, Header } from '@nestjs/common';
import { CrashReportsService } from './crashReports.service';
import { Response } from 'express';

@Controller('repos/:owner/:name/crash_reports')
export class CrashReportsController {
  constructor(private readonly crashReportsService: CrashReportsService) {}

  @Get(':id/download')
  @Header('Content-Type', 'application/octet-stream')
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const crashReport = await this.crashReportsService.find(id);

    // Only repeat the extension of the original file if it’s one of our expected ones. Not really sure if this is of any use, but I don’t really like the idea of being tricked into giving somebody a malicious .dmg file or something.
    const allowedExtensions = ['.crash', '.ips'];
    const extensionToUse = allowedExtensions.find((allowedExtension) =>
      crashReport.filename.endsWith(allowedExtension),
    );

    res.header(
      'Content-Disposition',
      `filename="crash_report_${crashReport.id}${extensionToUse ?? ''}"`,
    );
    return crashReport.data;
  }
}
