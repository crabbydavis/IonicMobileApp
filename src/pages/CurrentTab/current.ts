/**
 * Generated class for the CurrentPage page.
 *
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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

	private devices: any;
	private scanning: boolean = false;

	constructor(private navCtrl: NavController, private navParams: NavParams, private stackService: StackService, 
		private ble: BLE, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
		console.log('ionViewDidLoad CurrentPage');
	}
	
	ionViewWillLeave() {
		console.log("In will leave");
		/*for(let item of this.stackService.currentStack.items){
			item.nearby = null;
		}*/
		this.scanning = false;
	}

	ionViewWillUnload() {
		this.scanning = false;
		
	}

	private scan() {
		this.scanning = true;
		console.log(this.stackService.currentStack.items[0]);
		this.stackService.currentStack.items[0].nearby = true;
		console.log("Enabling Bluetooth");
		this.ble.isEnabled().then(result => {
			console.log("isEnabled " + result);
			this.scanning = true;
			let loading = this.loadingCtrl.create({
				content: 'Scanning...'
			}); // Show the user a loading spinner so they know they are being logged in
    		loading.present();
			this.ble.scan([], 5).subscribe(devices => {
				console.log("BLE devices " + JSON.stringify(devices));
				for(let device of devices) {
					for(let item of this.stackService.currentStack.items)
					if(device.id === item.id){
						item.nearby = true;
					}
				}
				loading.dismiss();
			});
		}).catch(err => {
			console.log("Error: " + err);
		});		
	}

	private foundItem(item): boolean {
		if(this.scanning){
			if(item.nearby){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	private foundNoItem(item): boolean {
		if(this.scanning){
			if(!item.nearby){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	private isNearby(item): string{
		if(this.scanning){
			if(item.nearby) {
				return 'green';
			} else {
				return 'red';
			}
		} else {
			return '';
		}
	}
}
