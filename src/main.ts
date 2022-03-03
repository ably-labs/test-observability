import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {json} from 'body-parser'
import {join} from 'path';
import {NestExpressApplication} from '@nestjs/platform-express';
import {configure} from 'nunjucks';

async function bootstrap() {
  if (!process.env.TEST_OBSERVABILITY_AUTH_KEY) {
    throw new Error("The TEST_OBSERVABILITY_AUTH_KEY environment variable must be set.")
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({limit: '5mb'}))

  app.useStaticAssets(join(__dirname, '..', '..', 'public'))

  configure(join(__dirname, '..', '..', 'views') /* This code is running from the `dist` dir */, {
    autoescape: true,
    express: app
  });

  app.setViewEngine('njk');

  await app.listen(parseInt(process.env.PORT ?? "3000", 10))
}
bootstrap();
