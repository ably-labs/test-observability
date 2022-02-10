import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsToUploads1644500106521 implements MigrationInterface {
    name = 'AddColumnsToUploads1644500106521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "junit_report_xml" xml NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_sha" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_ref_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_retention_days" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_action" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_run_number" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_run_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "iteration" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "iteration"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_run_id"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_run_number"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_action"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_retention_days"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_ref_name"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_sha"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "junit_report_xml"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "created_at"`);
    }

}
