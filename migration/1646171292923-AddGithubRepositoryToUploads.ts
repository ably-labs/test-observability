import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGithubRepositoryToUploads1646171292923 implements MigrationInterface {
    name = 'AddGithubRepositoryToUploads1646171292923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "github_repository" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "github_repository"`);
    }

}
