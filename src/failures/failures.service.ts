import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Failure } from '../uploads/failure.entity';

@Injectable()
export class FailuresService {
  constructor(
    @InjectRepository(Failure) private failuresRepository: Repository<Failure>,
  ) {}

  // Includes the test case.
  async find(id: string): Promise<Failure> {
    const results = await this.failuresRepository.find({
      where: { id },
      relations: ['testCase'],
    });
    return results[0];
  }
}
