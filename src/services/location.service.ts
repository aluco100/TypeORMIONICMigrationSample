import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationService{

  constructor(private geolocation: Geolocation) {}

  public checkLocation():Promise<any>{
    return new Promise((fulfill,reject)=>{
      //LOCALIZACION del MARRIOT
      const coords = {
        latitude: -33.4001845,
        // latitude: -41.310467,
        longitude: -70.5742595
        // longitude: -72.9884
      }
      this.geolocation.getCurrentPosition().then((resp) => {
        if(this.distanceFromTo(resp.coords.latitude,resp.coords.longitude,coords.latitude,coords.longitude) <= 2){
          fulfill();
        }else{
          reject(Error("Ubicación fuera de lugar"));
        }
      }).catch((error) => {
        reject(error);
        console.log('Error getting location', error);
      });
    })
  }


  private distanceFromTo(lat1,lon1,lat2,lon2):number{
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1))
            * Math.cos(this.deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg) {
  return deg * (Math.PI/180)
  }
}
