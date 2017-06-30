import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Auth } from '@ionic/cloud-angular';

import { TabsPage } from '../pages/tabs/tabs'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  rootPage:any;
  tabsPage:any = TabsPage;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public auth: Auth, 
              public loadingCtrl: LoadingController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(this.auth.isAuthenticated()){
        console.log("User is authenticated");
        this.rootPage = TabsPage;
      } else {
        this.rootPage = 'LandingPage';
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page: any) {
    this.rootPage = page;
  }

  logout() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.auth.logout();
    setTimeout(() => {
      loading.dismiss();
      this.nav.setRoot('LandingPage');
    }, 1000);
    
    // `this.user` is now registered and logged in. Go to the menu page
    //this.navCtrl.popToRoot;
  }
}
