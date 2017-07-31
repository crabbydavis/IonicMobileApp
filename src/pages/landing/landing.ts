/**
 * Generated class for the LandingPage page.
 *
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

	loginPage = 'LoginPage'; // Variable to navigate to the Login Page
	signupPage = 'SignupPage'; // Variable to navigate to the Sign Up Page

  constructor(public navCtrl: NavController, public navParams: NavParams, private statusbar: StatusBar, 
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }

  ionViewWillEnter() {
    //this.statusbar.styleLightContent();
  }

  ionViewDidEnter() {
    //this.statusbar.styleLightContent();
  }

  ionViewDidLeave() {
    //this.statusbar.styleDefault();
  }

  private openPage(page) {
    var modal = this.modalCtrl.create(page);
    modal.present();
  }

}
