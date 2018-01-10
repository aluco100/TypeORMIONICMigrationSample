import {Injectable} from '@angular/core';
import { ActionSheetController, Platform } from 'ionic-angular';
import { PermissionsService } from './permissions.service';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from "@ionic/storage";
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

declare var cordova: any;

@Injectable()
export class ImageService{

  protected lastImage:string;
  protected imagePromise: Promise<any>;

  /**
   * @constructor
   * @param  {ActionSheetController} privateactionSheetCtrl
   * @param  {Platform}              privateplatform
   * @param  {PermissionsService}    privatepermissionsService
   * @param  {Camera}                privatecamera
   * @param  {File}                  privatefile
   * @param  {FilePath}              privatefilepath
   * @param  {Storage}               privatestorage
   * @param  {ImageResizer}          privateimageResizer
   * @return {[type]}
   */
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private permissionsService: PermissionsService,
    private camera: Camera,
    private file: File,
    private filepath: FilePath,
    private storage: Storage,
    private imageResizer: ImageResizer
  ){
    this.imagePromise = this.storage.get('temp_image');
    this.imagePromise.then(image => {
      this.lastImage = image;
    });
  }

  setImage(name){
    this.storage.set('temp_image',name);
  }

  /**
   * Abrir el actionsheet de la galeria de fotos o camara
   * @return {void}
   */
  openActionSheet(){
    return new Promise((fulfill,reject)=>{
      let actionSheet = this.actionSheetCtrl.create({
       title: 'Agregar foto',
       buttons: [
         {
           text: 'Cámara',
           handler: () => {
             this.permissionsService.checkCameraPermissions().then(permissionOk =>{
               if(permissionOk){
                 this.takePicture(this.camera.PictureSourceType.CAMERA).then(imageName => {
                   console.log("actionsheet image: "+imageName);
                   console.log(this.camera.DestinationType);
                   this.lastImage = imageName;
                   this.storage.set('temp_image',imageName);
                   fulfill(imageName);
                 }).catch(error => reject(error));
               }
             });
           }
         },
         {
           text: 'Librería de fotos',
           handler: () => {
             this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY).then(imageName => {
               console.log("actionsheet image: "+imageName);
               this.lastImage = imageName;
               this.storage.set('temp_image',imageName);
               fulfill(imageName);
             }).catch(error => reject(error));
           }
         },
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () => {
             return fulfill(null);
           }
         }
       ]
     });
     actionSheet.present();
    });

  }

  /**
   * Obtencion de foto mediante la galería o la cámara
   * @param  {any}       sourceType
   * @return {Promise<any>}
   */
  private takePicture(sourceType):Promise<any>{
    //Create Options for camera
    return new Promise((fulfill,reject)=>{
      let options = {
          quality: 100,
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      this.resizeImage(imagePath).then((imagePath: string) => {
        // Special handling for Android library
        console.log("image path:"+imagePath);
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filepath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(fileName => {
                fulfill(fileName);
              }).catch(error => reject(error));
            });
          } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(fileName => {
              fulfill(fileName);
            }).catch(error => {
              console.log(error);
              reject(error);
            } );
          }
        }).catch(error => reject(error));
        }, (err) => {
          console.log(err);
          reject(err);
        });

    });
  }

  /**
   * Creación del nombre del archivo
   * @return {string}
   */
  private createFileName(){
    var d = new Date(),
    n = d.getTime(),
    newFileName = 'temp'+  n + ".jpg";
    return newFileName;
  }

  /**
   * Crear el archivo en el directorio de la data de cordova
   * @param  {string}       namePath
   * @param  {string}       currentName
   * @param  {string}       newFileName
   * @return {Promise<any>}
   */
  private copyFileToLocalDir(namePath, currentName, newFileName): Promise<any> {
    return new Promise((fulfill,reject)=>{
      console.log("namePath: "+namePath +" - currentName: "+currentName);
      this.file.removeFile(cordova.file.dataDirectory,this.lastImage).then(()=>{
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
          this.file.removeFile(namePath,currentName).then(()=>{
            fulfill(newFileName);
          }).catch(error=>reject(error));
        }, error => {
          reject(error);
        });
      }).catch(error => {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
          this.file.removeFile(namePath,currentName).then(()=>{
            fulfill(newFileName);
          }).catch(error=>reject(error));
        }, error => {
          reject(error);
        });
      });
    });
  }

  /**
   * Obtencion de la ruta del archivo de imagen
   * @param  {string} img
   * @return {string}
   */
  public pathForImage(img) {
    if (img === null) {
      return '';
    }
    return cordova.file.dataDirectory + img;
  }

  /**
   * Formatear el tamaño de imagen
   * @param  {string} uri
   * @return {Promise<any>}
   */
  private resizeImage(uri: string){
    return new Promise((fulfill,reject)=>{
      let options = {
        uri: uri,
        quality: 50,
        width: 800,
        height: 1200,
        fileName: 'resize.jpg'
        } as ImageResizerOptions;
        return this.imageResizer.resize(options).then((filepath)=> fulfill(filepath))
                                                .catch(error => reject(error));
    })

  }

  /**
   * Eliminar imagen
   * @return {Promise<any>}
   */
  public removeImage():Promise<any>{
    return new Promise((fulfill, reject)=>{
      this.file.removeFile(cordova.file.dataDirectory,this.lastImage).then(()=>{
        this.lastImage = null;
        this.storage.set('temp_image',this.lastImage);
        fulfill();
      }).catch(error => reject(error));
    })

  }

  /**
   * Eliminar imagen con nombre
   * @param  {string}       name [description]
   * @return {Promise<any>}      [description]
   */
  public removeImageWithName(name:string):Promise<any>{
    return new Promise((fulfill, reject)=>{
      this.file.removeFile(cordova.file.dataDirectory,name).then(()=>{
        fulfill();
      }).catch(error => reject(error));
    })

  }

  /**
   * Obtener la promesa de imagen
   * @return {Promise<any>}
   */
  public getImagePromise():Promise<any>{
    return this.imagePromise;
  }

  /**
   * Obtener el nombre de la imagen
   * @return {string}
   */
  public getImage(){
    return this.lastImage;
  }
}
