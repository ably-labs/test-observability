import {Upload} from "./upload.entity";
import {parse, TestSuites} from 'junit2json'

interface Failure {
  testCaseName: string
  message: string
}

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

  get failures(): Failure[] {
    const testCasesHavingFailure = this.testSuites.testsuite.flatMap(testSuite => testSuite.testcase.filter(testCase => testCase.failure))

    return testCasesHavingFailure.flatMap(testCase => testCase.failure.map(details => ({testCaseName: testCase.name, message: details.message})))
  }
}
