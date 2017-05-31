import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { User } from '../../model/user'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

import { MenuPage } from '../menu/menu';
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  users: FirebaseListObservable<any[]>;
  email: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: Auth, public user: User/*public newUser: User*/) {
  	this.users = db.list('/users');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
  	console.log("Got the email address: " + this.email + " and password: " + this.password);
  	//this.newUser = new User(emailAddress, password);   , "Password": password
  	//this.users.push({"EmailAddress": emailAddress});

  	let details: UserDetails = {
	  'name': 'Dave',
	  'email': this.email,
	  'password': this.password
	};

	//console.dir(details);
	console.log("User details " + 'details.email' + " " + details.password);
	console.log(details);

	this.auth.signup(details).then(() => {
	  // `this.user` is now registered
	  this.navCtrl.push(MenuPage);

	  //Check for all of the possible errors for signing up and alert user
	}, (err: IDetailedError<string[]>) => {
	  for (let e of err.details) {
	    if (e === 'conflict_email') {
	     	alert('Email already exists.');
	    } else if(e === 'invalid_email') {
	     	alert('Invalid Email');
	    } else if(e === 'required_email') {
	     	alert('Please enter a valid email');
	    } else if(e === 'required_password') {
	     	alert('Please enter a password');
	    } else if(e === 'conflict_email') {
	     	alert('Email is already in use');
	    } else if(e === 'conflict_username') {
	    	alert('Username already exists');
	    } else {
	    	alert('Unknown Error');
	    }
	  }
	});
  }

}
