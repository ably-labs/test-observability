import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGithubRunAttemptToUploads1644859027392 implements MigrationInterface {
    name = 'AddGithubRunAttemptToUploads1644859027392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_run_attempt" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_run_attempt"`);
    }

}
