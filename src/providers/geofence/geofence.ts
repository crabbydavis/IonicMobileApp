import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the GeofenceProvider provider.
*/

declare var google;

interface geofence{
  x: number;
  y: number;
  radius: number;
}

@Injectable()
export class GeofenceProvider {

  public geofence: geofence;
  public geolocationOptions: GeolocationOptions = {maximumAge: 0, enableHighAccuracy: true};
  private readonly ACCURACY_TOLERANCE: number = 0;
  private readonly UPPER_ACCURACY_LIMIT: number = 20; // In meters

  constructor(private platform: Platform, public storage: Storage, private geolocation: Geolocation, private events: Events,
    private nativeStorage: NativeStorage) {
    this.platform.ready().then(() => {
      console.log('Hello GeofenceProvider Provider');
      this.initGeofence();
    });
  }

  public updateGeofence(): void {
    console.log("Saving geofence to storage", this.geofence);
    this.nativeStorage.setItem('geofence', this.geofence);
    this.storage.set('geofence', this.geofence);
  }

  private initGeofence(): void {
    console.log("In ititGeofence");
    this.storage.get('geofence').then(storageGeofence => {
      if(storageGeofence){
        this.geofence = storageGeofence;
        this.events.publish('enteredGeofence:resetTrackerNotifications'); // Reset tracker notifications
        this.events.publish('setupGeofence:runInBackground'); // Start scanning
        console.log("Got the geofence from the DB", this.geofence);
      }
    }).catch(error => {
      console.log("Not able to get the geofence from storage");
    });
  }

  private deg2rad(deg): number {
    return deg * (Math.PI/180)
  }

  // See if the current position is in the geofence
  public currentlyInGeofence(): Promise<boolean>{
    console.log("Seeing if a point is currently in the geofence");
    return this.geolocation.getCurrentPosition(this.geolocationOptions).then(location => {
      console.log("Geofence:", this.geofence);
      let latLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude); 
      let circleLatLng = new google.maps.LatLng(this.geofence.x, this.geofence.y);       
      var distance = google.maps.geometry.spherical.computeDistanceBetween(circleLatLng, latLng);
      var accuracy = location.coords.accuracy;
      this.events.publish('newData:updateUI', this.geofence.radius, distance, accuracy);
      console.log("Distance: ", distance);
      console.log("Radius: ", this.geofence.radius);
      console.log("Accuracy: ", accuracy);
      if((distance > (this.geofence.radius + this.ACCURACY_TOLERANCE)) && (accuracy < this.UPPER_ACCURACY_LIMIT)){
        console.log("currentlyInGeofence returning false");        
        return false;
      } else if(distance > accuracy){
        return false;
      }else {
        console.log("currentlyInGeofence returning true");
        console.log("Accuracy: " + accuracy + "  and limit: " + this.UPPER_ACCURACY_LIMIT);
        return true;
      }
    });
  }
}
