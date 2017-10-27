import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
//import { Geofence } from '@ionic-native/geofence';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BLE } from '@ionic-native/ble';

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
  public readonly minRadius: number = 5;
  public readonly maxRadius: number = 50;
  public radius: number = this.minRadius;
  private marker: any;
  private circle: any;
 
  constructor(public navCtrl: NavController, private geolocation: Geolocation,
    private localNotifications: LocalNotifications, private ble: BLE) {
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
    this.geolocation.getCurrentPosition().then((resp) => {
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
      radius: this.radius,    // 10 miles in metres
      fillColor: '#00c6a7',
      draggable: true
    });
    this.circle.bindTo('center', this.marker, 'position');
  }

  private addGeofence() {
    //options describing geofence
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb-dtc', //any unique ID
      latitude: this.circle.getCenter().latitude, //center of geofence radius
      longitude: this.circle.getCenter().longitude,
      radius: this.radius, //radius to edge of geofence in meters
      transitionType: 2, //Just check when leaving geofence
      notification: { //notification settings
      }
    }
    /*
    this.geofence.addOrUpdate(fence).then(
       () => console.log('Geofence added'),
       (err) => console.log('Geofence failed to add')
     );

    this.geofence.onTransitionReceived().subscribe(res => {
      this.localNotifications.schedule({
        id: 1,
        at: new Date(new Date().getTime()),
        title: "Changed location",
        text: "Left the Geofence",
      });
    });*/
  }
}
