import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { User } from '../../model/user'

import { Auth, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

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
	private errorMessages: Array<string> = new Array<string>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, private app: App, 
		public alertCtrl: AlertController, public loadingCtrl: LoadingController, private statusbar: StatusBar) {
		
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

	ionViewWillEnter() {
		this.statusbar.styleDefault();
	}

  goBack() {
    this.navCtrl.pop();
  }

  signUp() {

		// first clear any existing errors
		this.errorMessages = Array<string>();
		
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
				loading.dismiss();
				for (let e of err.details) {
					//var errorMessage: string;
					if (e === 'conflict_email') {
						this.errorMessages.push('Email already exists.');
					} else if(e === 'invalid_email') {
						this.errorMessages.push('Invalid Email');
					} else if(e === 'required_email') {
						this.errorMessages.push('Please enter a valid email');
					} else if(e === 'required_password') {
						this.errorMessages.push('Please enter a password');
					} else if(e === 'conflict_email') {
						this.errorMessages.push('Email is already in use');
					} else if(e === 'conflict_username') {
						this.errorMessages.push('Username already exists');
					} else {
						this.errorMessages.push('Unknown Error');
					}
					/*let errorAlert = this.alertCtrl.create({
						title: 'Error',
						subTitle: errorMessage,
						buttons: ['Dismiss']
					});
					errorAlert.present();*/
					console.log("Error found");
				}
		});

		//this.app.getRootNav().setRoot('TabsPage');
    // `this.user` is now registered and logged in. Go to the menu page
  }

}
