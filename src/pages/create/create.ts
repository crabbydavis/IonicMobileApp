import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '@ionic/cloud-angular';

// import the model
import { Stack } from '../../model/stack'

import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {

	public stackName: string;
	public stacks: Array<Stack>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public viewCtrl: ViewController) {
  	// If the user has stacks then we will get them
  	this.stacks = this.user.get('stacks', []);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }

  // Save the new stack to the users stacks
  save(): void {
  		// Push a new Stack onto the stacks
  		var stack = new Stack(this.stackName);
  		this.stacks.push(stack);
  		// Replace the old stacks with the new one and save
  	  	this.user.set('stacks', this.stacks);
  	  	this.user.save();
  	  	//this.navCtrl.pop();
  	  	this.viewCtrl.dismiss(this.stacks).catch(err => {
  	  		console.log(err);
  	  	});
  }
}
