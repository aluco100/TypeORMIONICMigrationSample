import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { getRepository, Repository } from 'typeorm';
import { Product } from "../model/product";
import { LocationService } from "./location.service";
import { NetworkService } from "./network.service";
import { ProductService } from "./product.service";
import { ImageService } from "./image.service";
import {ProductRefactoring1515586923234} from "../migrations/1515586923234-ProductRefactoring";

@Injectable()
export class DatabaseService {

  public observer: Observable<any>;
  public subscriber: Subscriber<any>;

  constructor(private locationService: LocationService,
    private networkService: NetworkService,
    private productService: ProductService,
    private imageService: ImageService) {
    this.observer = new Observable(observer => {
      this.subscriber = observer;
    });
  }

  async createSchema(): Promise<any> {
    return new Promise(async (fulfill, reject) => {
      await createConnection({
        type: 'cordova',
        database: 'test',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        synchronize: true,
        entities: [
          Product
        ]
      }).then(() => fulfill())
        .catch(error => reject(error));
    })

  }

  async runMigrations(){

    let connection = await createConnection({
      type: 'cordova',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [
        Product
      ],
      migrations: [ProductRefactoring1515586923234]
    });
    await connection.runMigrations();
    await connection.close();
    // await connection.runMigrations()
    //   .then(() => {
    //     console.log("migrations successfully");
    //   }).catch(error => console.log("ERROR MIGRATIONS: " + JSON.stringify(error)));


  }

  async productList(): Promise<any> {
    return new Promise(async (fulfill, reject) => {

      let productRepository = await getRepository(Product);

      let allProducts = await productRepository.find()
        .then(products => fulfill(products))
        .catch(error => reject(error));

    });
  }

  async insertProduct(product: Product): Promise<any> {
    return new Promise(async (fulfill, reject) => {

      let productRepository = await getRepository(Product);

      await productRepository.save(product)
        .then(() => fulfill())
        .catch(error => reject(error));

    });
  }

  updateProducts(productsForSync: Array<Product>) {
    if (this.networkService.networkType() != 'none') {

      this.productService.sendProduct(productsForSync[0]).then(async () => {

        console.log("producto enviado");
        this.imageService.removeImageWithName(productsForSync[0].photo);

        let productRepository = await getRepository(Product);

        let product = await productRepository.findOneById(productsForSync[0].id);

        product.status = 2;

        await productRepository.save(product);

        productsForSync.splice(0, 1);
        if (productsForSync.length > 0) {
          this.updateProducts(productsForSync);
        }
        this.productList().then(products => {
          this.subscriber.next(products);
        }).catch(error => console.log("Error observer: " + error));

      }).catch(error => console.log("Error server: " + JSON.stringify(error)));
    } else {
      console.log("NO HAY INTERNET");
    }
  }

  getSubscriber(): Subscriber<any> {
    return this.subscriber;
  }

  getObservable(): Observable<any> {
    return this.observer;
  }

}
