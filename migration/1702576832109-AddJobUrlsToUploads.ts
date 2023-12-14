import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJobUrlsToUploads1702576832109 implements MigrationInterface {
    name = 'AddJobUrlsToUploads1702576832109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_job_api_url" character varying`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_job_html_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_job_html_url"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_job_api_url"`);
    }

}
