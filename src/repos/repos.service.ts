import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../uploads/upload.entity';

@Injectable()
export class ReposService {
  constructor(
    @InjectRepository(Upload) private uploadsRepository: Repository<Upload>,
  ) {}

  async fetchRepos(): Promise<string[]> {
    // We want github_head_ref if not null, else github_ref_name
    const sql = `SELECT DISTINCT
        uploads.github_repository as github_repository
    FROM
        uploads
    ORDER BY
        github_repository ASC`;

    const results: Record<string, any>[] = await this.uploadsRepository.query(
      sql,
    );

    return results.map((row) => row['github_repository']);
  }
}
