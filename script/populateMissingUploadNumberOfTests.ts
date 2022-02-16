import {NestFactory} from '@nestjs/core';
import {UploadsService} from '../src/uploads/uploads.service';
import {AppModule} from '../src/app.module';

async function run() {
    const context = await NestFactory.createApplicationContext(AppModule)
    const uploadsService = context.get(UploadsService)

    await uploadsService.populateMissingNumberOfTests()
}
run();
