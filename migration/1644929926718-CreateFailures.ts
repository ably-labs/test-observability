import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFailures1644929926718 implements MigrationInterface {
    name = 'CreateFailures1644929926718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "failures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "message" character varying NOT NULL, "upload_id" uuid NOT NULL, CONSTRAINT "PK_079b915b80b138e3477acb42f6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_945be252d69aa2f1cb7319dbc1" ON "failures" ("id", "order") `);
        await queryRunner.query(`ALTER TABLE "failures" ADD CONSTRAINT "FK_91968bedf93cff1a79fa715b1a0" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "failures" DROP CONSTRAINT "FK_91968bedf93cff1a79fa715b1a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_945be252d69aa2f1cb7319dbc1"`);
        await queryRunner.query(`DROP TABLE "failures"`);
    }

}
