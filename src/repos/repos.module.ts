import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from '../uploads/upload.entity';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}
