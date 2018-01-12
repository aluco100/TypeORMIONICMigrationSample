import {MigrationInterface, QueryRunner,Table,TableColumn} from "typeorm";

export class ProductRefactoring1515692942255 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      // ALTER TABLE team RENAME TO team_orig;
      // await queryRunner.addColumn(new Table("product"),new TableColumn({name : "author"}));
      await queryRunner.query("ALTER TABLE product ADD COLUMN author");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropColumn(new Table("product"),new TableColumn({name : "author"}));
      // await queryRunner.query("ALTER TABLE product DROP COLUMN 'author'");
    }

}
