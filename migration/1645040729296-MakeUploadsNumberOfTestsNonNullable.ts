import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeUploadsNumberOfTestsNonNullable1645040729296 implements MigrationInterface {
    name = 'MakeUploadsNumberOfTestsNonNullable1645040729296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "number_of_tests" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "number_of_tests" DROP NOT NULL`);
    }

}
