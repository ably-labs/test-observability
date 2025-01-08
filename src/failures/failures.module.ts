import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Failure } from '../uploads/failure.entity';
import { FailuresController } from './failures.controller';
import { FailuresService } from './failures.service';
import { ReportsService } from 'src/uploads/reports.service';
import { Upload } from 'src/uploads/upload.entity';
import { TestCase } from 'src/uploads/testCase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Failure, Upload, TestCase])],
  controllers: [FailuresController],
  providers: [FailuresService, ReportsService],
})
export class FailuresModule {}
