import {Controller, Get} from '@nestjs/common';
import {UploadsService} from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  async all(): Promise<string> {
    const uploads = await this.uploadsService.findAll()
    return `There are ${uploads.length} uploads`
  }
}
