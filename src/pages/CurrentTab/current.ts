/**
 * Generated class for the CurrentPage page.
 *
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

// import the model
import { Stack } from '../../model/stack';
import { StackItem, TrackerItem } from '../../model/stackItem';

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
		private ble: BLE, private loadingCtrl: LoadingController, private statusbar: StatusBar) {
  	}	

  	ionViewDidLoad() {
		console.log('ionViewDidLoad CurrentPage');
		this.statusbar.styleLightContent();
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

	private isTracker(item){
		console.log(item.constructor);
		console.log('isTracker: ', item.constructor.name);
		if(item.constructor.name === 'TrackerItem'){
			return true;
		} else {
			return false;
		}
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
					for(let item of this.stackService.currentStack.items){
						// If the item is a tracker then cast it so we can check the id
						if(item.constructor.name === "TrackerItem"){
							var trackerItem = <TrackerItem>item; 
							if(device.id === trackerItem.id){
								item.nearby = true;
							}
						}
					}
				}
				loading.dismiss();
			});
		}).catch(err => {
			console.log("Error: " + err);
		});		
	}

	public foundItem(item): boolean {
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

	public foundNoItem(item): boolean {
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

	public isNearby(item): string{
		if(this.scanning){
			if(item.nearby) {
				return '#00c6a7';
			} else {
				return '#cf502a';
			}
		} else {
			return '';
		}
	}
}
