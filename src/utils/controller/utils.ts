import { Repo } from 'src/repos/repo';
import { UploadsFilter } from 'src/uploads/uploads.service';

export class ControllerUtils {
  static createRepoFromQuery(owner: string, name: string): Repo {
    return { owner, name };
  }

  static createFilterFromQuery(
    branches: string[] | undefined,
    createdBefore: string | undefined,
    createdAfter: string | undefined,
    failureMessage: string | undefined,
    onlyFailuresWithCrashReports: string | undefined,
  ): UploadsFilter {
    let createdBeforeDate: Date | null = null;
    if (createdBefore !== undefined && createdBefore.length > 0) {
      createdBeforeDate = new Date(createdBefore);
    }

    let createdAfterDate: Date | null = null;
    if (createdAfter !== undefined && createdAfter.length > 0) {
      createdAfterDate = new Date(createdAfter);
    }

    let failureMessageOrNull: string | null = null;
    if (failureMessage !== undefined && failureMessage.length > 0) {
      failureMessageOrNull = failureMessage;
    }

    let onlyFailuresWithCrashReportsBoolean = false;
    if (onlyFailuresWithCrashReports == 'true') {
      onlyFailuresWithCrashReportsBoolean = true;
    }

    return {
      branches: branches ?? [],
      createdBefore: createdBeforeDate,
      createdAfter: createdAfterDate,
      failureMessage: failureMessageOrNull,
      onlyFailuresWithCrashReports: onlyFailuresWithCrashReportsBoolean,
    };
  }
}
