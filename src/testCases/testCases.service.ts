import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repo } from 'src/repos/repo';
import { UploadsFilter } from 'src/uploads/uploads.service';
import { UploadsFilterWhereClause } from 'src/utils/database/uploadsFilterWhereClause';
import { Repository } from 'typeorm';
import { TestCase } from '../uploads/testCase.entity';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectRepository(TestCase)
    private testCasesRepository: Repository<TestCase>,
  ) {}

  // Includes failures, but not their uploads (except for createdAt, githubHeadRef, and githubRefName).
  // TODO find a good way to represent this in the type system
  async find(
    id: string,
    repo: Repo,
    failuresFilter: UploadsFilter,
  ): Promise<TestCase> {
    const whereClause =
      UploadsFilterWhereClause.createFromFilterUsingNamedParams(
        repo,
        failuresFilter,
      );

    let queryBuilder = this.testCasesRepository
      .createQueryBuilder('testCase')
      .where('testCase.id = :id', { id })
      .leftJoinAndSelect('testCase.failures', 'failures')
      .innerJoin('failures.upload', 'uploads')
      .addSelect([
        'uploads.createdAt',
        'uploads.githubHeadRef',
        'uploads.githubRefName',
      ])
      .leftJoin('failures.crashReports', 'crash_reports')
      .orderBy('uploads.createdAt', 'DESC');

    const fragment = whereClause.uploadsAndFailuresAndCrashReportsClause({
      includeWhereKeyword: false,
    });
    if (fragment !== null) {
      queryBuilder = queryBuilder.andWhere(fragment, whereClause.params);
    }

    return await queryBuilder.getOneOrFail();
  }
}
