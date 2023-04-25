import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrashReport } from '../uploads/crashReport.entity';

@Injectable()
export class CrashReportsService {
  constructor(
    @InjectRepository(CrashReport)
    private crashReportsRepository: Repository<CrashReport>,
  ) {}

  async find(id: string): Promise<CrashReport> {
    const results = await this.crashReportsRepository.find({
      where: { id },
    });
    return results[0];
  }
}
