import { Repo } from 'src/repos/repo';
import { UploadsFilter } from 'src/uploads/uploads.service';

interface ClauseCreationOptions {
  includeWhereKeyword: boolean;
}

export class UploadsFilterWhereClause<Params> {
  constructor(
    private readonly uploadsSubClauses: string[],
    private readonly failuresAndCrashReportsSubClauses: string[],
    readonly params: Params,
  ) {}

  static createFromFilterUsingPositionalParams(
    repo: Repo,
    filter: UploadsFilter,
  ): UploadsFilterWhereClause<unknown[]> {
    return this.createFromFilter<unknown[]>(
      repo,
      filter,
      [],
      (i) => `$${i}`,
      (i, val, params) => {
        params[i - 1] = val;
        return params;
      },
    );
  }

  static createFromFilterUsingNamedParams(
    repo: Repo,
    filter: UploadsFilter,
  ): UploadsFilterWhereClause<Record<string, unknown>> {
    return this.createFromFilter<Record<string, unknown>>(
      repo,
      filter,
      {},
      (i) => `:uploadsFilterParam${i}`,
      (i, val, params) => {
        params[`uploadsFilterParam${i}`] = val;
        return params;
      },
    );
  }

  private static createFromFilter<Params>(
    repo: Repo,
    filter: UploadsFilter,
    initialParams: Params,
    createParamName: (index: number) => string,
    addParam: (index: number, value: unknown, currentParams: Params) => Params,
  ) {
    const uploadsSubClauses: string[] = [];
    const failuresAndCrashReportsSubClauses: string[] = [];
    let params = initialParams;

    let parameterCount = 0;

    if (filter.branches?.length) {
      parameterCount += 1;
      // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
      uploadsSubClauses.push(
        `uploads.github_ref_name = ANY (${createParamName(
          parameterCount,
        )}) OR uploads.github_head_ref = ANY (${createParamName(
          parameterCount,
        )})`,
      );
      params = addParam(parameterCount, filter.branches, params);
    }

    parameterCount += 1;
    uploadsSubClauses.push(
      `uploads.github_repository = ${createParamName(parameterCount)}`,
    );
    params = addParam(parameterCount, repo.owner + '/' + repo.name, params);

    if (filter.createdBefore) {
      parameterCount += 1;
      uploadsSubClauses.push(
        `uploads.created_at < ${createParamName(parameterCount)}`,
      );
      params = addParam(parameterCount, filter.createdBefore, params);
    }

    if (filter.createdAfter) {
      parameterCount += 1;
      uploadsSubClauses.push(
        `uploads.created_at > ${createParamName(parameterCount)}`,
      );
      params = addParam(parameterCount, filter.createdAfter, params);
    }

    if (filter.failureMessage) {
      parameterCount += 1;
      // The ::text cast is to avoid an error from Postgres that I don’t really understand: "could not determine data type of parameter $1"
      failuresAndCrashReportsSubClauses.push(
        `failures.message ILIKE CONCAT('%', ${createParamName(
          parameterCount,
        )}::text, '%')`,
      );
      const escapedFailureMessage = filter.failureMessage
        .replace('%', '\\%')
        .replace('_', '\\_');
      params = addParam(parameterCount, escapedFailureMessage, params);
    }

    if (filter.onlyFailuresWithCrashReports) {
      parameterCount += 1;

      failuresAndCrashReportsSubClauses.push('crash_reports.id IS NOT NULL');
    }

    return new this(
      uploadsSubClauses,
      failuresAndCrashReportsSubClauses,
      params,
    );
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

  uploadsAndFailuresAndCrashReportsClause(
    options: ClauseCreationOptions,
  ): string | null {
    return this.createClause(
      this.uploadsSubClauses.concat(this.failuresAndCrashReportsSubClauses),
      options,
    );
  }
}
