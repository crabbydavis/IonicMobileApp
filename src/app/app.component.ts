import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
//import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Auth } from '@ionic/cloud-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { GeofenceProvider } from '../providers/geofence/geofence';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * This app utilizes the background mode to do ble scanning in the background
 * As long as the app isn't closed, it will be running and checking to scan
 */

@Component({
  templateUrl: 'app.html'
})
export class Stack {
  @ViewChild(Nav) nav:Nav;

  rootPage:any;
  tabsPage:any = TabsPage;
  private timerInsideGeofence;
  private timerOutsideGeofence;

  constructor(public platform: Platform, public splashScreen: SplashScreen, public auth: Auth, 
    public loadingCtrl: LoadingController, private localNotifications: LocalNotifications, private alertCtrl: AlertController,
    private background: BackgroundMode, private events: Events, private deviceMotion: DeviceMotion, 
    private geofenceProvider: GeofenceProvider, private nativeStorage: NativeStorage) {

    this.platform.ready().then(() => {

      this.subscribeToEvents();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(this.auth.isAuthenticated()){
        console.log("User is authenticated");
        this.rootPage = TabsPage;
      } else {
        this.rootPage = 'LandingPage';
      }
      splashScreen.hide();
      if(!this.localNotifications.hasPermission()){
        this.localNotifications.registerPermission();
      }
    });
  }

  private subscribeToEvents(){
    this.events.subscribe('setupGeofence:runInBackground', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log("Going to run the app in the background");
      this.runInBackground();
    });
    // Event to stop all scanning
    this.events.subscribe('missingItems:stop', () => {
      console.log("Clearing the interval timers");
      clearInterval(this.timerInsideGeofence);
      clearInterval(this.timerOutsideGeofence);
    });
  }

  openPage(page: any) {
    this.rootPage = page;
  }
  
  public logout() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.auth.logout();
    setTimeout(() => {
      loading.dismiss();
      this.nav.setRoot('LandingPage');
      //this.background();
    }, 1000);
  }

  // This will be the background task scanning
  private runInBackground() {
    this.nativeStorage.getItem('setupGeofence').then(res => {
      if(res){
        console.log("Starting to run in the background");
        this.background.enable(); // Enable the app to run in the background
        this.backgroundInsideGeofence(); // Assume that the user is inside the geofence
      }
    }).catch(error => {
      console.log("setupGeofence is not currently in Native Storage");
    });
  }
  
  private backgroundOutsideGeofence(){
    this.timerOutsideGeofence = setInterval(() => {
      console.log("In BackgroundOutsideGeofence");
      //this.deviceIsMoving().then(res => {
        //if(res){
          this.events.publish('outsideGeofence:scan');
          this.geofenceProvider.currentlyInGeofence().then(res => {
            if(res){
              clearInterval(this.timerOutsideGeofence);
              this.events.publish('enteredGeofence:resetTrackerNotifications');
              this.backgroundInsideGeofence();
            }
          });
        //}
      //})
    }, 60000); // Execute every 60
  }

  private backgroundInsideGeofence(){
    this.timerInsideGeofence = setInterval(() => {
      console.log("In BackgroundInsideGeofence");
      this.deviceIsMoving().then(res => {
        if(res){
          this.geofenceProvider.currentlyInGeofence().then(res => {
            console.log("Res for currently in Geofence: ", res);
            if(!res){
              console.log("Going to publish left geofence");
              this.events.publish('outsideGeofence:scan');
              clearInterval(this.timerInsideGeofence);
              this.backgroundOutsideGeofence();
            }
          });
        }
      })
    }, 15000); // Execute every 15 seconds
  }

  private deviceIsMoving(): Promise<boolean | void>{
    return this.deviceMotion.getCurrentAcceleration().then((acceleration: DeviceMotionAccelerationData) => {
      console.log("Accelerating x: " + Math.round(acceleration.x));
      console.log("Accelerating y: " + Math.round(acceleration.y));
      //console.log("Accelerating z: " + Math.round(acceleration.z));
      if(Math.round(acceleration.x) === 0 && Math.round(acceleration.y) === 0){
        console.log("Device is not moving");
        return false;
      } else {
        console.log("Device is moving");
        return true;
      }
    }).catch((error: any) => {
      console.log("Error when trying to get the acceleration of the device", error);
    });
  }
}
