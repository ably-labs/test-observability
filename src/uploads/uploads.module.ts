import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UploadsController} from './uploads.controller';
import {UploadsService} from './uploads.service';
import {Upload} from './upload.entity'
import {Failure} from './failure.entity';
import {TestCase} from './testCase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, Failure, TestCase])],
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UploadsModule {}
