import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeSomeUploadsFieldsNonNullable1645641805627 implements MigrationInterface {
    name = 'MakeSomeUploadsFieldsNonNullable1645641805627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_base_ref" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_head_ref" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_job" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_job" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_head_ref" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "github_base_ref" DROP NOT NULL`);
    }

}
