import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Auth } from '@ionic/cloud-angular';
import { AlertController, LoadingController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { App } from 'ionic-angular';
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

  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public auth: Auth, 
              private app: App, 
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  login() {
    let loading = this.loadingCtrl.create(); // Show the user a loading spinner so they know they are being logged in
    loading.present();

    let loginDetails = {'email': this.email, 'password': this.password};  // Get the Login details we will use to login
    this.auth.login('basic', loginDetails).then(user => { // `this.user` is now registered and logged in. Go to the tabs/current page
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    }, errors => { // Any failure in login will result in the same error message shown to the user
      let errorAlert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please enter a valid email and password combination',
        buttons: ['Dismiss']
      });
      errorAlert.present();
      return;
    }).catch((errors) => { // Catch any miscellaneous erros to prevent the user from seeing them
      console.log(errors);
    });
  }
}
