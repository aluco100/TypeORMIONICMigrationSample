import {MigrationInterface, QueryRunner,Table,TableColumn} from "typeorm";
import {Product} from "../model/product";

export class ProductRefactoring1515695789696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("ALTER TABLE product RENAME TO tmp_product;");
      await queryRunner.query(`CREATE TABLE IF NOT EXISTS product (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name VARCHAR(45),
                        timestamp INT,
                        description MEDIUMTEXT,
                        quantity INT,
                        photo VARCHAR(45),
                        status INT)`);
      await queryRunner.query(`INSERT INTO product(id, name,timestamp,description,quantity,photo,status)
                              SELECT id, name,timestamp,description,quantity,photo,status FROM tmp_product;`);
      await queryRunner.query("DROP TABLE tmp_product;");
      // await queryRunner.dropColumn(new Table("product"),new TableColumn({name : "author"}));
      // await queryRunner.query("ALTER TABLE product DROP COLUMN author");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      // await queryRunner.addColumn(new Table("product"),new TableColumn({name : "author"}))
      await queryRunner.query("ALTER TABLE product ADD COLUMN author TEXT");
    }

}
