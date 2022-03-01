import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Failure} from '../uploads/failure.entity'
import {FailuresController} from './failures.controller'
import {FailuresService} from './failures.service'

@Module({
  imports: [TypeOrmModule.forFeature([Failure])],
  controllers: [FailuresController],
  providers: [FailuresService]
})
export class FailuresModule {}
