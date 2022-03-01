import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeGithubRepositoryNonNullable1646171528600 implements MigrationInterface {
    name = 'MakeGithubRepositoryNonNullable1646171528600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_repository" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_repository" DROP NOT NULL`);
    }

}
