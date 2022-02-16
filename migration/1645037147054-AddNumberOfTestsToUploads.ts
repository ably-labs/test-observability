import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNumberOfTestsToUploads1645037147054 implements MigrationInterface {
    name = 'AddNumberOfTestsToUploads1645037147054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ADD "number_of_tests" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "number_of_tests"`);
    }

}
