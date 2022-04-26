import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './uploads/upload.entity';
import { UploadsModule } from './uploads/uploads.module';
import { Failure } from './uploads/failure.entity';
import { TestCase } from './uploads/testCase.entity';
import { TestCasesModule } from './testCases/testCases.module';
import { FailuresModule } from './failures/failures.module';
import { ReposModule } from './repos/repos.module';
import { CrashReport } from './uploads/crashReport.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql:///test_observation',
      ssl: process.env.DATABASE_URL
        ? {
            rejectUnauthorized: false, // Heroku uses self-signed certs
          }
        : false, // This is a bit messy; I want SSL for Heroku and not locally
      migrations: ['dist/migration/*.js'],
      migrationsRun: true,
      entities: [Upload, Failure, TestCase, CrashReport],
      // TODO use Nest logger
      logging: 'all',
      logger: 'advanced-console',
    }),
    UploadsModule,
    TestCasesModule,
    FailuresModule,
    ReposModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
