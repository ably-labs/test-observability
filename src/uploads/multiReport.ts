import {Failure} from "./junitReport";
import {Report} from "./report";

export class MultiReport {
  constructor(readonly reports: Report[]) {}

  private isSameFailure(a: Failure, b: Failure): boolean {
    return a.testClassName == b.testClassName && a.testCaseName == b.testCaseName
  }

  // This does not take the failure _message_ into account, i.e. the same
  // test could be failing for different reasons each time.
  get failuresWithOccurrenceCount(): {failure: Failure, occurrenceCount: number}[] {
    return this.reports.reduce((accum, report) => {
      let newAccum = accum

      const failures = report.junitReport.failures

      failures.forEach(failure => {
        const existingIndex = accum.findIndex(val => this.isSameFailure(val.failure, failure))
        if (existingIndex >= 0) {
          newAccum[existingIndex].occurrenceCount += 1
        } else {
          newAccum = [...newAccum, {failure, occurrenceCount: 1}]
        }
      })

      return newAccum
    }, new Array<{failure: Failure, occurrenceCount: number}>())
  }

  get failuresByDescendingOccurrenceOrder(): {failure: Failure, occurrenceCount: number}[] {
    return this.failuresWithOccurrenceCount.sort((a, b) => b.occurrenceCount - a.occurrenceCount)
  }
}

