import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { User } from '../../model/user'

import { Auth, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController, LoadingController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { App } from 'ionic-angular';
/**
 * Generated class for the SignupPage page.
 *
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  //users: FirebaseListObservable<any[]>;
  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;

  constructor(public navCtrl: NavController, 
							public navParams: NavParams, 
							public auth: Auth, 
							private app: App, 
							public alertCtrl: AlertController,
							public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  signUp() {

  	let details: UserDetails = {
			'name': this.firstName + " " + this.lastName,
			'email': this.email,
			'password': this.password
		};

	//console.dir(details);
	console.log("User details " + 'details.email' + " " + details.password);
	console.log(details);

	// Show the user loading symbol while signing them up and logging them in
	let loading = this.loadingCtrl.create();
  loading.present();

	this.auth.signup(details).then(() => {
		this.auth.login('basic', details).then(() => {
				loading.dismiss();
				// If the signup is successful then log the user in and send them to tabs/current page
				this.navCtrl.setRoot(TabsPage);
		}, (err: IDetailedError<string[]>) => {
			console.log(err);
		});
	  //Check for all of the possible errors for signing up and alert user
		}, (err: IDetailedError<string[]>) => {
			for (let e of err.details) {
				var alertText: string;
				if (e === 'conflict_email') {
					alertText = 'Email already exists.';
				} else if(e === 'invalid_email') {
					alertText = 'Invalid Email';
				} else if(e === 'required_email') {
					alertText = 'Please enter a valid email';
				} else if(e === 'required_password') {
					alertText = 'Please enter a password';
				} else if(e === 'conflict_email') {
					alertText = 'Email is already in use';
				} else if(e === 'conflict_username') {
					alertText = 'Username already exists';
				} else {
					alertText = 'Unknown Error';
				}
				let errorAlert = this.alertCtrl.create({
					title: 'Error',
					subTitle: alertText,
					buttons: ['Dismiss']
				});
				errorAlert.present();
			}
		});

		//this.app.getRootNav().setRoot('TabsPage');
    // `this.user` is now registered and logged in. Go to the menu page
  }

}
