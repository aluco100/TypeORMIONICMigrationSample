import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ImageService } from "../services/image.service";
import { IonicStorageModule } from '@ionic/storage';
import { ImageResizer } from '@ionic-native/image-resizer';
import {LocationService} from "../services/location.service";
import { Network } from '@ionic-native/network';
import { HttpModule} from '@angular/http';
import {DatabaseService} from "../services/database.service";
import { Geolocation } from '@ionic-native/geolocation';
import {NetworkService} from "../services/network.service";
import {ProductService} from "../services/product.service";
import {RestangularModule} from "ngx-restangular";
import { RestangularConfigFactory} from '../services/global';
import {PermissionsService} from "../services/permissions.service";
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path"


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddProductPage } from "../pages/add-product/add-product.component";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddProductPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    RestangularModule.forRoot(RestangularConfigFactory)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddProductPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImageService,
    LocationService,
    ImageResizer,
    DatabaseService,
    Geolocation,
    Network,
    NetworkService,
    ProductService,
    PermissionsService,
    Diagnostic,
    Camera,
    File,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
