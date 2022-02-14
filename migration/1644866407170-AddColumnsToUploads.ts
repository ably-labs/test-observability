import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsToUploads1644866407170 implements MigrationInterface {
    name = 'AddColumnsToUploads1644866407170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_base_ref" character varying`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_head_ref" character varying`);
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_job" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_job"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_head_ref"`);
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_base_ref"`);
    }

}
