import {Upload} from "./upload.entity";
import {parse, TestSuites} from 'junit2json'

export class JUnitReport {
  private constructor(private readonly testSuites: TestSuites) {}

  static async createFromUpload(upload: Upload): Promise<JUnitReport> {
    const testSuites = await parse(upload.junitReportXml)
    return new JUnitReport(testSuites)
  }

  get numberOfTests(): number {
    return this.testSuites.tests
  }

  get numberOfFailures(): number {
    return this.testSuites.failures
  }
}
