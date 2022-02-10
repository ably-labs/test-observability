import {MigrationInterface, QueryRunner} from "typeorm";

export class SetUploadsIdDefault1644496779354 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE uploads ALTER COLUMN id SET DEFAULT uuid_generate_v4();")
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        throw new Error("Not reversible")
    }

}
