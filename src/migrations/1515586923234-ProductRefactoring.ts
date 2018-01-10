import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductRefactoring1515586923234 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.renameColumn("product","thumbnail","photo");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.renameColumn("product","photo","thumbnail");
    }

}
