import {Failure} from "./junitReport";
import {Report} from "./report";
import {Upload} from "./upload.entity";

interface FailureReport {
  failure: Failure
  occurrenceCount: number
  lastSeenIn: Upload
}

interface TestCaseFailuresReportEntry {
  upload: Upload
  message: string
}

type TestCaseFailuresReport = TestCaseFailuresReportEntry[]

export class MultiReport {
  constructor(readonly reports: Report[]) {}

  private isSameFailure(a: Failure, b: Failure): boolean {
    return a.testClassName == b.testClassName && a.testCaseName == b.testCaseName
  }

  // This does not take the failure _message_ into account, i.e. the same
  // test could be failing for different reasons each time.
  get failuresWithOccurrenceCount(): FailureReport[] {
    return this.reports.reduce((accum, report) => {
      let newAccum = accum

      const failures = report.junitReport.failures

      failures.forEach(failure => {
        const existingIndex = accum.findIndex(val => this.isSameFailure(val.failure, failure))
        if (existingIndex >= 0) {
          newAccum[existingIndex].occurrenceCount += 1

          if (report.upload.createdAt > accum[existingIndex].lastSeenIn.createdAt) {
            newAccum[existingIndex].lastSeenIn = report.upload
          }
        } else {
          newAccum = [...newAccum, {failure, occurrenceCount: 1, lastSeenIn: report.upload}]
        }
      })

      return newAccum
    }, new Array<FailureReport>())
  }

  get failuresByDescendingOccurrenceOrder(): FailureReport[] {
    return this.failuresWithOccurrenceCount.sort((a, b) => b.occurrenceCount - a.occurrenceCount)
  }

  failuresForTestCase(testClassName: string, testCaseName: string): TestCaseFailuresReport {
    return this.reports.flatMap(
      report => report.junitReport.failures.map(
        failure => ({failure, upload: report.upload})
      ).filter(
        val => val.failure.testClassName == testClassName && val.failure.testCaseName == testCaseName
      ).map(val => ({upload: val.upload, message: val.failure.message}))
    )
  }
}

