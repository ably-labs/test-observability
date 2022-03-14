import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeGithubBaseAndHeadRefsNullable1647279654975 implements MigrationInterface {
    name = 'MakeGithubBaseAndHeadRefsNullable1647279654975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_base_ref" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_head_ref" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_head_ref" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_base_ref" SET NOT NULL`);
    }

}
