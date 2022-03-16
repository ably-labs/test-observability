import { UploadsFilter } from 'src/uploads/uploads.service';

export class ControllerUtils {
  static createFilterFromQuery(
    branches: string[] | undefined,
    createdBefore: string | undefined,
    createdAfter: string | undefined,
    failureMessage: string | undefined,
  ): UploadsFilter | null {
    if (
      branches === undefined &&
      (createdBefore?.length ?? 0) == 0 &&
      (createdAfter?.length ?? 0) == 0 &&
      !failureMessage?.length
    ) {
      return null;
    }

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
      branches: branches ?? [],
      createdBefore: createdBeforeDate,
      createdAfter: createdAfterDate,
      failureMessage: failureMessageOrNull,
    };
  }
}
