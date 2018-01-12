import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductRefactoring1515761659288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("ALTER TABLE product RENAME TO tmp_product;");
      await queryRunner.query(`CREATE TABLE IF NOT EXISTS product (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title VARCHAR(45),
                        timestamp INT,
                        description MEDIUMTEXT,
                        quantity INT,
                        photo VARCHAR(45),
                        status INT)`);
      await queryRunner.query(`INSERT INTO product(id, title,timestamp,description,quantity,photo,status)
                              SELECT id, name,timestamp,description,quantity,photo,status FROM tmp_product;`);
      await queryRunner.query("DROP TABLE tmp_product;");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
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
                              SELECT id, title,timestamp,description,quantity,photo,status FROM tmp_product;`);
      await queryRunner.query("DROP TABLE tmp_product;");
    }

}
