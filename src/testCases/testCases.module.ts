import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from 'src/uploads/reports.service';
import { Upload } from 'src/uploads/upload.entity';
import { Failure } from '../uploads/failure.entity';
import { TestCase } from '../uploads/testCase.entity';
import { TestCasesController } from './testCases.controller';
import { TestCasesService } from './testCases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, Failure, TestCase])],
  controllers: [TestCasesController],
  providers: [TestCasesService, ReportsService],
})
export class TestCasesModule {}
