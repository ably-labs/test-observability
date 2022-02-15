import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UploadsController} from './uploads.controller';
import {UploadsService} from './uploads.service';
import {Upload} from './upload.entity'
import {Failure} from './failure.entity';
import {TestCase} from './testCase.entity';
import {TestCasesService} from './testCases.service';
import {ReportsService} from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, Failure, TestCase])],
  controllers: [UploadsController],
  providers: [UploadsService, TestCasesService, ReportsService]
})
export class UploadsModule {}
