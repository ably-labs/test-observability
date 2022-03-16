import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  // Includes failures, but not their uploads (except for createdAt).
  // TODO find a good way to represent this in the type system
  async find(
    id: string,
    failuresFilter: UploadsFilter | null,
  ): Promise<TestCase> {
    const whereClause =
      UploadsFilterWhereClause.createFromFilter(failuresFilter);

    let queryBuilder = this.testCasesRepository
      .createQueryBuilder('testCase')
      .where('testCase.id = :id', { id })
      .leftJoinAndSelect('testCase.failures', 'failures')
      .innerJoin('failures.upload', 'uploads')
      .addSelect('uploads.createdAt')
      .orderBy('uploads.createdAt', 'ASC');

    const fragment = whereClause.uploadsAndFailuresClause({
      includeWhereKeyword: false,
    });
    if (fragment !== null) {
      // This is very hacky - the UploadsFilterWhereClause is written with positional parameters in mind, but QueryBuilder requires us to use named parameters. So we substitute the $1, $2 etc in the fragment with :uploadsFilterParam1, :uploadsFilterParam2 etc.
      const paramsObject: Record<string, any> = {};
      let modifiedFragment = fragment;

      whereClause.params.forEach((param, index) => {
        const paramName = `uploadsFilterParam${index + 1}`;
        modifiedFragment = modifiedFragment.replace(
          `$${index + 1}`,
          `:${paramName}`,
        );
        paramsObject[paramName] = param;
      });

      queryBuilder = queryBuilder.andWhere(modifiedFragment, paramsObject);
    }

    return await queryBuilder.getOneOrFail();
  }
}
