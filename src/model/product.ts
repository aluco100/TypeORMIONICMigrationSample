import {Entity,Column,PrimaryGeneratedColumn} from "typeorm";
@Entity('product')
export class Product{

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name:string;

  @Column("int")
  timestamp: number;

  @Column("text")
  description: string;

  @Column("int")
  quantity: number;

  @Column({nullable: true})
  photo: string;

  @Column("int")
  status: number;

  // @Column({nullable: true})
  // author: string;

}
