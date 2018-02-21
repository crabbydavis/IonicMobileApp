import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { Auth, IDetailedError } from '@ionic/cloud-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { TabsPage } from '../tabs/tabs';

import { App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the LoginPage page.
 *
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('nav') nav: Nav;

  private email: string = "";
  private password: string = "";
  private anyErrors: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public auth: Auth, 
              private app: App, 
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController, private statusbar: StatusBar, private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
		this.statusbar.styleDefault();
	}

  goBack() {
    //this.navCtrl.pop();
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500,
      slowdownfactor: 0,
      slidePixels: 0,
      iosdelay: 0,
      androiddelay: 0,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 0
    };
    this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot('LandingPage');
  }

  login() {
    this.navCtrl.setRoot(TabsPage);
    /*
    let loading = this.loadingCtrl.create(); // Show the user a loading spinner so they know they are being logged in
    loading.present();

    let loginDetails = {'email': this.email, 'password': this.password};  // Get the Login details we will use to login
    this.auth.login('basic', loginDetails).then(user => { // `this.user` is now registered and logged in. Go to the tabs/current page
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    }, (err: IDetailedError<string[]>) => { // Any failure in login will result in the same error message shown to the user
      loading.dismiss();
      this.anyErrors = true;
      return;
    })/*.catch((errors) => { // Catch any miscellaneous erros to prevent the user from seeing them
      console.log(errors);
    });*/
  }
}
