import {Injectable} from '@angular/core';
import {Product} from "../model/product";
import 'rxjs/add/operator/map';
import {Global} from "./global";
import {Restangular} from "ngx-restangular";

@Injectable()
export class ProductService{

  public url:string;

  constructor(private rest: Restangular){
    this.url = Global.url;
  }

  sendProduct(product:Product):Promise<any>{

    let body: any = {
      name: product.name,
      timestamp: product.timestamp,
      description: product.description,
      quantity: product.quantity,
      thumbnail: product.photo
    }

    return this.rest.all("product")
              .post(body)
              .toPromise()
  }
}
