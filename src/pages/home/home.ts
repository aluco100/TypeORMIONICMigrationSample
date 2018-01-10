import { Component, NgZone,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Product } from "../../model/product";
import { DatabaseService } from "../../services/database.service";
import { AddProductPage } from "../add-product/add-product.component";
import { NetworkService } from "../../services/network.service";
import { NetworkProtocol } from "../../protocols/network.protocol";
import { ProductService } from "../../services/product.service";
import { PermissionsService } from "../../services/permissions.service";
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DatabaseService, NetworkService, ProductService,
    PermissionsService, Diagnostic, Camera, File, FilePath]
})
export class HomePage implements NetworkProtocol,OnInit{

  public data: Observable<Array<Product>>;
  public products: Array<Product>;
  public isDisconnected: boolean;

  constructor(public navCtrl: NavController,
    private databaseService: DatabaseService,
    private networkService: NetworkService,
    private zone: NgZone) {
    this.networkService.networkProtocol = this;
    this.networkService.checkConnections();
    this.isDisconnected = !this.networkService.isConnected();
  }

  ngOnInit() {
    this.data = this.databaseService.getObservable();
    let subscription = this.data.subscribe(value => {
      console.log("LISTO: " + JSON.stringify(value));
      this.zone.run(() => this.products = <Array<Product>>value);
    }, error => console.log("Error observer:" + JSON.stringify(error)));
  }

  ionViewDidEnter() {
    this.databaseService.runMigrations().then(()=>{
      this.databaseService.createSchema().then(()=>{
        this.loadProducts();
      }).catch(error => {
        console.log("Error:"+JSON.stringify(error));
        this.loadProducts();
      });
    }).catch(error => {
      console.log("ERROR in migration: "+ JSON.stringify(error));
      this.loadProducts();
    });
  }

  async loadProducts(){
    await this.databaseService.productList().then(products => {
      console.log("productos: "+JSON.stringify(products));
      this.products = products;
      this.updateProducts();
    });
  }

  changeNetwork() {
    console.log("network changed");
    this.updateProducts();
    this.zone.run(() => this.isDisconnected = !this.networkService.isConnected());
  }


  addProduct() {
    this.navCtrl.push(AddProductPage);
    console.log("add product");
  }

  updateProducts() {
    let productsForSync = this.products.filter(product => product.status == 1);
    if (productsForSync.length > 0) {
      this.databaseService.updateProducts(productsForSync);
    }
  }


}
