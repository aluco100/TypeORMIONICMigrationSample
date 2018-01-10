import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';


@Injectable()
export class PermissionsService {

  /**
   * @constructor
   * @param  {Platform}   public_platform
   * @param  {Diagnostic} public_Diagnostic
   */
  constructor(
    public _platform: Platform,
    public _Diagnostic: Diagnostic
  ) {
  }

  /**
   * Verificar si el dispositivo tiene la plataforma android
   * @return {boolean}
   */
  isAndroid() {
    return this._platform.is('android')
  }

  /**
   * Verificar si el dispositivo tiene la plataforma iOS
   * @return {boolean}
   */
  isiOS() {
    return this._platform.is('ios');
  }

  isUndefined(type) {
    return typeof type === "undefined";
  }

  /**
   * revisar los permisos de la camara
   * @return {Promise<boolean>}
   */
  checkCameraPermissions(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.isiOS()) {
        this._Diagnostic.getCameraAuthorizationStatus().then(status => {
          if (status == this._Diagnostic.permissionStatus.GRANTED) {
            resolve(true);
          }
          else if (status == this._Diagnostic.permissionStatus.DENIED) {
            resolve(false);
          }
          else if (status == this._Diagnostic.permissionStatus.NOT_REQUESTED || status.toLowerCase() == 'not_determined') {
            this._Diagnostic.requestCameraAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
      else if (this.isAndroid()) {
        this._Diagnostic.isCameraAuthorized().then(authorised => {
          if (authorised) {
            resolve(true);
          }
          else {
            this._Diagnostic.requestCameraAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
    });
  }

}
