import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TestCase} from '../uploads/testCase.entity';

@Injectable()
export class TestCasesService {
  constructor(@InjectRepository(TestCase) private testCasesRepository: Repository<TestCase>) {}

  // Includes failures, but not their uploads.
  async find(id: string): Promise<TestCase> {
    const results = await this.testCasesRepository.find({where: {id}, relations: ['failures']})
    return results[0]
  }
}
