import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
// import the model
import { Stack } from '../../model/stack';
import { StackItem, TrackerItem } from '../../model/stackItem';
//Services
import { StackService } from '../../providers/stack-service/stack-service';
import { BLE } from '@ionic-native/ble';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the CurrentPage page.
 *
 */

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentTab {

	private devices: any;
	private scanning: boolean = false;

	constructor(private navCtrl: NavController, private navParams: NavParams, private stackService: StackService, 
		private ble: BLE, private loadingCtrl: LoadingController, private statusbar: StatusBar, private events: Events,
		private localNotifications: LocalNotifications) {
	  
		this.events.subscribe('leftGeofence:scan', () => {
			// user and time are the same arguments passed in `events.publish(user, time)`
			console.log("Going to scan");
			this.scan();
		});
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

	private resetDevicesFound(){
		this.stackService.currentStack.trackerItems.forEach(tracker => {
			tracker.nearby = false;
		});
	}

	private scan() {
		this.scanning = true;
		console.log("Enabling Bluetooth");
		this.ble.isEnabled().then(result => {
			console.log("isEnabled " + result);
			this.scanning = true;
			let loading = this.loadingCtrl.create({
				content: 'Scanning...'
			}); // Show the user a loading spinner so they know they are being logged in
			//loading.present();
			this.resetDevicesFound(); // Reset the devices to not found before scanning
			this.ble.startScan([]).subscribe(
				device => {
					//console.log("BLE devices " + JSON.stringify(device));
					//console.log("Name of device: " + device.name);
					/*if(device.name === "tkr"){
						console.log("Found TKR************************************");
					}*/
					for(let tracker of this.stackService.currentStack.trackerItems){
						if(device.id === tracker.id){
							tracker.nearby = true;
						}
					}
					//loading.dismiss();
				}, error => console.log("Error when scanning", error)
			);
			setTimeout(() => {
				console.log("In the completion scanner code to send notification");
				this.ble.stopScan();
				//var forgottenItems: string = "";
				var forgottenItems = new Array<string>(); 
				var counter: number = 0;
				for(let tracker of this.stackService.currentStack.trackerItems){
					counter++;
					if(!tracker.nearby){
						forgottenItems.push(tracker.name);
					}
				}
				// Only send a notification if items were not found
				if(forgottenItems.length > 0){
					this.events.publish('missingItems:stop');
					var missingItems: string = this.buildNotificationString(forgottenItems);
					this.localNotifications.schedule({
						id: 1,
						at: new Date(new Date().getTime()),
						title: "Missing Items!",
						text: "We could't find " + missingItems,
					});
					this.localNotifications.on('click', () => {
						console.log("User clicked the notification");
					});
				}
			}, 10000);
		}).catch(err => {
			console.log("Error: " + err);
		});		
	}

	private buildNotificationString(forgottenItems: Array<string>): string{
		var	displayString:string = "";
		for(var i = 0; i < forgottenItems.length; i++){
			if((i + 1) === forgottenItems.length){
				displayString += forgottenItems[i];
			} else {
				displayString += (forgottenItems[i] + ", ");
			}
		}
		return displayString;
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
