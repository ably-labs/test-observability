import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Failure} from './failure.entity';
import {JUnitReport} from './junitReport';
import {TestCase} from './testCase.entity';
import {Upload} from './upload.entity';

@Injectable()
export class UploadsService {
  constructor(@InjectRepository(Upload) private uploadsRepository: Repository<Upload>, @InjectRepository(TestCase) private testCasesRepository: Repository<TestCase>, @InjectRepository(Failure) private failuresRepository: Repository<Failure>) {}

  findAll(): Promise<Upload[]> {
    return this.uploadsRepository.find()
  }

  async find(id: string): Promise<Upload> {
    const results = await this.uploadsRepository.find({id})
    return results[0]
  }

  async create(params: Omit<Upload, 'id' | 'createdAt' | 'failures'>): Promise<Upload> {
    const upload = new Upload()
    Object.assign(upload, params)
    // I'm saving this so that I have an ID for the failures?
    await this.uploadsRepository.save(upload)

    await this.populateFailuresForUpload(upload)

    return upload
  }

  async populateFailuresForUpload(upload: Upload): Promise<void> {
    const junitReport = await JUnitReport.createFromUpload(upload)

    // TODO how to avoid n+1 here
    // TODO a transaction – no idea how to do that, since you apparently need to directly use a connection / entity manager
    // TODO race issues for the find-or-create?
    // TODO probably far too much serial stuff here
    for (let i = 0; i < junitReport.failures.length; i++) {
      const junitReportFailure = junitReport.failures[i]

      let testCase = (await this.testCasesRepository.find({testClassName: junitReportFailure.testClassName, testCaseName: junitReportFailure.testCaseName}))[0]
      if (!testCase) {
        testCase = new TestCase()
        testCase.testClassName = junitReportFailure.testClassName
        testCase.testCaseName = junitReportFailure.testCaseName
        await this.testCasesRepository.save(testCase)
      }

      let failure = new Failure()
      failure.upload = upload
      failure.testCase = testCase
      failure.order = i
      failure.message = junitReportFailure.message

      await this.failuresRepository.save(failure)
    }
  }

  // This is only used in a one-off script.
  async populateMissingUploadFailures(): Promise<void> {
    const uploadsWithoutFailures = (await this.uploadsRepository.find({relations: ["failures"]})).filter(upload => upload.failures.length == 0)

    console.log(`Found ${uploadsWithoutFailures.length} uploads without failures.`)

    while (uploadsWithoutFailures.length > 0) {
      const upload = uploadsWithoutFailures[0]
      console.log("Populating failures for ", upload)
      await this.populateFailuresForUpload(upload)
      uploadsWithoutFailures.shift()
    }
  }
}
