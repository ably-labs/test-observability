import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCrashReports1651001992803 implements MigrationInterface {
  name = 'CreateCrashReports1651001992803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "crash_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "data" character varying NOT NULL, "failure_id" uuid NOT NULL, CONSTRAINT "PK_515d8c3c388e2e8e9de919c53bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "crash_reports" ADD CONSTRAINT "FK_6262410a20106b48c9a36fffcaa" FOREIGN KEY ("failure_id") REFERENCES "failures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crash_reports" DROP CONSTRAINT "FK_6262410a20106b48c9a36fffcaa"`,
    );
    await queryRunner.query(`DROP TABLE "crash_reports"`);
  }
}
