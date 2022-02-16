import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Failure} from '../uploads/failure.entity'
import {TestCase} from '../uploads/testCase.entity'
import {TestCasesController} from './testCases.controller'
import {TestCasesService} from './testCases.service'

@Module({
  imports: [TypeOrmModule.forFeature([Failure, TestCase])],
  controllers: [TestCasesController],
  providers: [TestCasesService]
})
export class TestCasesModule {}
