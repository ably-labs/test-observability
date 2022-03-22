import { UploadsFilter } from 'src/uploads/uploads.service';

export class ControllerUtils {
  static createFilterFromQuery(
    owner: string,
    repo: string,
    branches: string[] | undefined,
    createdBefore: string | undefined,
    createdAfter: string | undefined,
    failureMessage: string | undefined,
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

    return {
      owner: owner,
      repo: repo,
      branches: branches ?? [],
      createdBefore: createdBeforeDate,
      createdAfter: createdAfterDate,
      failureMessage: failureMessageOrNull,
    };
  }
}
