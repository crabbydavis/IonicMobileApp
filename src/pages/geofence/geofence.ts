import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Events, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
//import { Geofence } from '@ionic-native/geofence';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BLE } from '@ionic-native/ble';
import { GeofenceProvider } from '../../providers/geofence/geofence';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the GeofencePage page.
 * 
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-geofence',
  templateUrl: 'geofence.html',
})
export class GeofencePage {

  @ViewChild('map') mapElement: ElementRef;
  private map: any;
  public readonly minRadius: number = 10; // This is in meters
  public readonly maxRadius: number = 50;
  public radius: number = this.minRadius;
  private marker: any;
  private circle: any;
 
  constructor(public navCtrl: NavController, private geolocation: Geolocation,
    private localNotifications: LocalNotifications, private ble: BLE, private geofenceProvider: GeofenceProvider,
    private nativeStorage: NativeStorage, private events: Events, private toastCtrl: ToastController) {
     // initialize the plugin
    /*geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    );*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeofencePage');
    this.loadMap();
  }

  private loadMap() {
    this.geolocation.getCurrentPosition(this.geofenceProvider.geolocationOptions).then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      
      let mapOptions = {
        center: latLng,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      }
  
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setTilt(0);
      this.addMarker();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  public updateCircle(){
    this.circle.setRadius(this.radius);
    console.log("circle center: ", this.circle.getCenter());
  }

  private addMarker(){
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
    });
    
    // Add circle overlay and bind to marker
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.radius,
      fillColor: '#00c6a7',
      draggable: true
    });
    this.circle.bindTo('center', this.marker, 'position');
  }

  private addGeofence() {
    console.log("Added Geofence");
    var lat: number = this.marker.getPosition().lat();
    var lng: number = this.marker.getPosition().lng();
    this.geofenceProvider.geofence = { x: lat, y: lng, radius: this.radius};
    this.geofenceProvider.updateGeofence();
    this.nativeStorage.setItem('setupGeofence', true);
    let toast = this.toastCtrl.create({
      message: 'Geofence Saved',
      duration: 1500,
      position: 'middle',
      cssClass: 'custom-toast'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.events.publish('setupGeofence:runInBackground'); // Have the background task start running
      this.navCtrl.pop();      
    });
    toast.present();
    
    //options describing geofence
    /*
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb-dtc', //any unique ID
      latitude: this.circle.getCenter().latitude, //center of geofence radius
      longitude: this.circle.getCenter().longitude,
      radius: this.radius, //radius to edge of geofence in meters
      transitionType: 2, //Just check when leaving geofence
      notification: { //notification settings
      }
    }*/
  }
}
