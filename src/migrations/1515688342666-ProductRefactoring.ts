import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductRefactoring1515688342666 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("product","name","nombre");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("product","nombre","name");
  }

}
