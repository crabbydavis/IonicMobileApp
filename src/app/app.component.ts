import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Auth } from '@ionic/cloud-angular';
import { BLE } from '@ionic-native/ble';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class Stack {
  @ViewChild(Nav) nav:Nav;

  rootPage:any;
  tabsPage:any = TabsPage;

  constructor(public platform: Platform, public splashScreen: SplashScreen, public auth: Auth, 
    public loadingCtrl: LoadingController, private localNotifications: LocalNotifications, private alertCtrl: AlertController,
    private backgroundGeolocation: BackgroundGeolocation, private ble: BLE, private events: Events) {

    platform.ready().then(() => {
      this.initBackgroundGeolocation();
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
      /*
      if(!this.localNotifications.hasPermission()){
        this.localNotifications.registerPermission();
      }
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        at: new Date(new Date().getTime() + 10000),
        title: 'Snowboarding Stack',
        text: 'You\'ve left behind your goggles!',
      });
      */
    });
  }

  openPage(page: any) {
    this.rootPage = page;
  }

  private initBackgroundGeolocation(){

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0, //Desired accuracy in meters. Possible values [0, 10, 100, 1000]
      stationaryRadius: 10,
      distanceFilter: 5,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle and get push notifications w/ info.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      saveBatteryOnBackground: false, // Switch to less accurate significant changes and region monitory when in background (default)
    };

    this.backgroundGeolocation.configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {
      let time = location.time;
      //console.log(location);
      // Sent a local notification when getting an updat
      this.localNotifications.schedule({
        id: 1,
        at: new Date(new Date().getTime()),
        title: "Changed location",
        text: time.toString(),
      });
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      this.backgroundGeolocation.finish(); // FOR IOS ONLY
    });
    // start recording location
    this.backgroundGeolocation.start();
  }

  public triggerLocalNotification(){
    let prompt = this.alertCtrl.create({
      title: 'Custom Local Notification',
      message: "Enter the title for the notification",
      inputs: [
        {
          name: 'title',
          placeholder: 'title'
        },
        {
          name: 'text',
          placeholder: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            // Schedule a single notification
            this.localNotifications.schedule({
              id: 1,
              at: new Date(new Date().getTime() + 10000),
              title: data.title,
              text: data.text,
            });
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  public logout() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.auth.logout();
    setTimeout(() => {
      loading.dismiss();
      this.nav.setRoot('LandingPage');
      this.background();
    }, 1000);
  }

  // This will be the background task scanning
  private background() {
    console.log("In background in app.component.ts");
    this.events.publish('leftGeofence:scan');
	}
}
