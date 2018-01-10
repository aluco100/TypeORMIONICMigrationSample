import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { ImageService } from "../../services/image.service";
import { normalizeURL } from 'ionic-angular';
import { PermissionsService } from "../../services/permissions.service";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { Product } from "../../model/product";
import { LocationService } from "../../services/location.service";
import { Geolocation } from '@ionic-native/geolocation';
import { DatabaseService } from "../../services/database.service";

@Component({
  selector: 'add-product',
  templateUrl: 'add-product.html',
  providers: [ImageService, PermissionsService, Diagnostic,
    Camera, File, FilePath, LocationService, Geolocation, DatabaseService]
})
export class AddProductPage {

  public date: any = new Date().toISOString();
  public thumbnail: string;
  public uriImage: string;
  public imageName: string;
  public product: Product;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private imageService: ImageService,
    private platform: Platform,
    private databaseService: DatabaseService
  ) {
    this.product = new Product();
  }

  ngOnInit() {
    this.imageService.getImagePromise().then(image => {
      this.thumbnail = normalizeURL(this.imageService.pathForImage(image));
      this.uriImage = this.imageService.pathForImage(image);
      this.imageName = image;
    }).catch(error => console.log(error));
  }

  /**
   * guardar un producto
   * @return {[type]} [description]
   */
  saveProduct() {
    this.product.timestamp = 0;
    this.product.status = 1;
    this.product.photo = this.imageName;
    this.databaseService.insertProduct(this.product).then(()=>{
      this.thumbnail = null;
      this.uriImage = null;
      this.imageService.setImage(null);
      this.navCtrl.pop();
    }).catch(error=>{
      console.log("Error: " + error);
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'No se ha podido agregar el producto.',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  /**
   * Agregar una foto
   * @return void
   */
  addPhoto() {
    console.log("add photo");
    this.imageService.openActionSheet().then(imageUri => {
      console.log("imagen: " + this.imageService.pathForImage(imageUri));
      if (imageUri != "") {
        this.thumbnail = normalizeURL(this.imageService.pathForImage(imageUri));
        this.uriImage = this.imageService.pathForImage(imageUri);
        this.imageName = <string>imageUri;
        console.log("image path preview: " + this.thumbnail);
      }
    }).catch(error => console.log(error));
  }

  /**
   * Eliminar foto
   * @return void
   */
  removePhoto() {
    this.imageService.removeImage().then(() => {
      this.thumbnail = null;
      this.uriImage = null;
      console.log(this.thumbnail);
    }).catch(error => console.log(error));
  }
}
