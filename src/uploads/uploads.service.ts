import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Upload} from './upload.entity';

@Injectable()
export class UploadsService {
  constructor(@InjectRepository(Upload) private uploadsRepository: Repository<Upload>) {}

  findAll(): Promise<Upload[]> {
    return this.uploadsRepository.find()
  }

  create(params: Omit<Upload, 'id' | 'createdAt'>): Promise<Upload> {
    const upload = new Upload()
    Object.assign(upload, params)
    return this.uploadsRepository.save(upload)
  }
}
