import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrashReport } from './crashReport.entity';
import { Failure } from './failure.entity';
import { JUnitReport } from './junitReport';
import { TestCase } from './testCase.entity';
import { Upload } from './upload.entity';

export interface UploadsFilter {
  // empty implies no branches filter
  branches: string[];
  createdBefore: Date | null;
  createdAfter: Date | null;
  // case-insensitive contains
  failureMessage: string | null;
  onlyFailuresWithCrashReports: boolean;
}

export interface UploadCreationCrashReport {
  filename: string;
  testClassName: string;
  testCaseName: string;
  data: Buffer;
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload) private uploadsRepository: Repository<Upload>,
    @InjectRepository(TestCase)
    private testCasesRepository: Repository<TestCase>,
    @InjectRepository(Failure) private failuresRepository: Repository<Failure>,
    @InjectRepository(CrashReport)
    private crashReportsRepository: Repository<CrashReport>,
  ) {}

  findAll(): Promise<Upload[]> {
    return this.uploadsRepository.find();
  }

  // Includes failures
  async find(id: string): Promise<Upload> {
    const results = await this.uploadsRepository.find({
      where: { id },
      relations: ['failures', 'failures.testCase'],
    });
    return results[0];
  }

  async create(
    params: Omit<Upload, 'id' | 'createdAt' | 'failures' | 'numberOfTests'>,
    crashReports: UploadCreationCrashReport[] | null,
  ): Promise<Upload> {
    const upload = new Upload();
    Object.assign(upload, params);

    const junitReport = await JUnitReport.createFromUpload(upload);
    upload.numberOfTests = junitReport.numberOfTests;

    // I'm saving this so that I have an ID for the failures?
    await this.uploadsRepository.save(upload);

    const failures = await this.populateFailuresForUpload(upload, junitReport);

    if (crashReports !== null) {
      await this.populateCrashReportsForFailures(failures, crashReports);
    }

    return upload;
  }

  async populateFailuresForUpload(
    upload: Upload,
    junitReport: JUnitReport,
  ): Promise<Failure[]> {
    const failures: Failure[] = [];
    // TODO how to avoid n+1 here
    // TODO a transaction – no idea how to do that, since you apparently need to directly use a connection / entity manager
    // TODO race issues for the find-or-create?
    // TODO probably far too much serial stuff here
    for (let i = 0; i < junitReport.failures.length; i++) {
      const junitReportFailure = junitReport.failures[i];

      let testCase = (
        await this.testCasesRepository.find({
          testClassName: junitReportFailure.testClassName,
          testCaseName: junitReportFailure.testCaseName,
        })
      )[0];
      if (!testCase) {
        testCase = new TestCase();
        testCase.testClassName = junitReportFailure.testClassName;
        testCase.testCaseName = junitReportFailure.testCaseName;
        await this.testCasesRepository.save(testCase);
      }

      const failure = new Failure();
      failure.upload = upload;
      failure.testCase = testCase;
      failure.order = i;
      failure.message = junitReportFailure.message;

      await this.failuresRepository.save(failure);

      failures.push(failure);
    }

    return failures;
  }

  async populateCrashReportsForFailures(
    failures: Failure[],
    crashReports: UploadCreationCrashReport[],
  ): Promise<void> {
    // TODO same concerns as in populateFailuresForUpload
    for (let i = 0; i < crashReports.length; i++) {
      const uploadCreationCrashReport = crashReports[i];

      const failure = failures.find(
        (failure) =>
          failure.testCase.testClassName ==
            uploadCreationCrashReport.testClassName &&
          failure.testCase.testCaseName ==
            uploadCreationCrashReport.testCaseName,
      );

      if (!failure) {
        throw new Error(
          `No failure found with testClassName ${uploadCreationCrashReport.testClassName} and testCaseName ${uploadCreationCrashReport.testCaseName}`,
        );
      }

      const crashReport = new CrashReport();
      crashReport.filename = uploadCreationCrashReport.filename;
      crashReport.data = uploadCreationCrashReport.data.toString('utf8');
      crashReport.failure = failure;

      await this.crashReportsRepository.save(crashReport);
    }
  }

  // This is only used in a one-off script.
  async populateMissingUploadFailures(): Promise<void> {
    const uploadsWithoutFailures = (
      await this.uploadsRepository.find({ relations: ['failures'] })
    ).filter((upload) => upload.failures.length == 0);

    console.log(
      `Found ${uploadsWithoutFailures.length} uploads without failures.`,
    );

    while (uploadsWithoutFailures.length > 0) {
      const upload = uploadsWithoutFailures[0];
      console.log('Populating failures for ', upload);
      const junitReport = await JUnitReport.createFromUpload(upload);
      await this.populateFailuresForUpload(upload, junitReport);
      uploadsWithoutFailures.shift();
    }
  }

  // This is only used in a one-off script.
  async populateMissingNumberOfTests(): Promise<void> {
    // https://github.com/typeorm/typeorm/issues/828 I don't really understand this 'upload' alias
    const uploadsWithoutNumberOfTests = await this.uploadsRepository
      .createQueryBuilder('upload')
      .select(['upload.id'])
      .where({ numberOfTests: null })
      .getMany();

    console.log(
      `Found ${uploadsWithoutNumberOfTests.length} uploads with null numberOfTests.`,
    );

    for (let i = 0; i < uploadsWithoutNumberOfTests.length; i++) {
      const upload = uploadsWithoutNumberOfTests[i];
      const fullUpload = await this.uploadsRepository.findOneOrFail({
        id: upload.id,
      });
      console.log('Populating numberOfTests for ', fullUpload);
      const junitReport = await JUnitReport.createFromUpload(fullUpload);
      fullUpload.numberOfTests = junitReport.numberOfTests;
      await this.uploadsRepository.save(fullUpload);
    }
  }
}
