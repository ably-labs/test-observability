import { UploadsFilter } from 'src/uploads/uploads.service';

interface ClauseCreationOptions {
  includeWhereKeyword: boolean;
}

export class UploadsFilterWhereClause {
  constructor(
    private readonly uploadsSubClauses: string[],
    private readonly failuresSubClauses: string[],
    readonly params: unknown[],
  ) {}

  static createFromFilter(filter: UploadsFilter | null) {
    const uploadsSubClauses: string[] = [];
    const failuresSubClauses: string[] = [];
    const params: unknown[] = [];

    let parameterCount = 0;

    if (filter?.branches?.length) {
      parameterCount += 1;
      // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
      uploadsSubClauses.push(
        `uploads.github_ref_name = ANY ($${parameterCount}) OR uploads.github_head_ref = ANY ($${parameterCount})`,
      );
      params.push(filter.branches);
    }

    if (filter?.createdBefore) {
      parameterCount += 1;
      uploadsSubClauses.push(`uploads.created_at < $${parameterCount}`);
      params.push(filter.createdBefore);
    }

    if (filter?.createdAfter) {
      parameterCount += 1;
      uploadsSubClauses.push(`uploads.created_at > $${parameterCount}`);
      params.push(filter.createdAfter);
    }

    if (filter?.failureMessage) {
      parameterCount += 1;
      // The ::text cast is to avoid an error from Postgres that I don’t really understand: "could not determine data type of parameter $1"
      failuresSubClauses.push(
        `failures.message ILIKE CONCAT('%', $${parameterCount}::text, '%')`,
      );
      const escapedFailureMessage = filter.failureMessage
        .replace('%', '\\%')
        .replace('_', '\\_');
      params.push(escapedFailureMessage);
    }

    return new this(uploadsSubClauses, failuresSubClauses, params);
  }

  private createClause(
    subClauses: string[],
    options: ClauseCreationOptions,
  ): string | null {
    if (subClauses.length == 0) {
      return null;
    }

    const condition = subClauses.map((clause) => `(${clause})`).join(' AND ');

    return `${options.includeWhereKeyword ? 'WHERE ' : ''}${condition}`;
  }

  uploadsClause(options: ClauseCreationOptions): string | null {
    return this.createClause(this.uploadsSubClauses, options);
  }

  uploadsAndFailuresClause(options: ClauseCreationOptions): string | null {
    return this.createClause(
      this.uploadsSubClauses.concat(this.failuresSubClauses),
      options,
    );
  }
}
