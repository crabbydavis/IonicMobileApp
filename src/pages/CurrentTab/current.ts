/**
 * Generated class for the CurrentPage page.
 *
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import the model
import { Stack } from '../../model/stack';
import { StackItem } from '../../model/stackItem';

//Services
import { StackService } from '../../providers/stack-service/stack-service';

import { BLE } from '@ionic-native/ble';


@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentTab {

	//public currentStack = new Stack("None");
	public stackItems: Array<StackItem>;
	private devices: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public stackService: StackService, public ble: BLE) {

  	/*if(this.navParams.get('param1')){
  		this.currentStack = this.navParams.get('param1');

  		if(this.currentStack.items.length > 0) {
  			this.stackItems = this.currentStack.items;
  		}

  	}*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrentPage');
  }

	private scan() {
		console.log("Enabling Bluetooth");
		this.ble.isEnabled().then(result => {
			console.log("isEnabled " + result);
		}).catch(err => {
			console.log("Error: " + err);
		});
		console.log("Enabling Bluetooth");
		var ble = this.ble.scan([], 5).subscribe(device => {
				console.log("BLE devices " + JSON.stringify(device));
		});
	}
}
