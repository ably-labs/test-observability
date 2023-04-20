import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrashReport } from '../uploads/crashReport.entity';
import { CrashReportsController } from './crashReports.controller';
import { CrashReportsService } from './crashReports.service';

@Module({
  imports: [TypeOrmModule.forFeature([CrashReport])],
  controllers: [CrashReportsController],
  providers: [CrashReportsService],
})
export class CrashReportsModule {}
