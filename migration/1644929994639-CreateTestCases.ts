import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTestCases1644929994639 implements MigrationInterface {
    name = 'CreateTestCases1644929994639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_cases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "test_class_name" character varying NOT NULL, "test_case_name" character varying NOT NULL, CONSTRAINT "PK_39eb2dc90c54d7a036b015f05c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ab88c883b1c14160621b1e376f" ON "test_cases" ("test_class_name", "test_case_name") `);
        await queryRunner.query(`ALTER TABLE "failures" ADD "test_case_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "failures" ADD CONSTRAINT "FK_189333a0d9ac3ab230f6ea7b10c" FOREIGN KEY ("test_case_id") REFERENCES "test_cases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "failures" DROP CONSTRAINT "FK_189333a0d9ac3ab230f6ea7b10c"`);
        await queryRunner.query(`ALTER TABLE "failures" DROP COLUMN "test_case_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab88c883b1c14160621b1e376f"`);
        await queryRunner.query(`DROP TABLE "test_cases"`);
    }

}
