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
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';    

/**
 * Generated class for the CurrentPage page.
 *
 */

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
  animations: [
    trigger('grow', [
      state('inactive', style({height: 0, overflow: 'hidden'})),
      state('active', style({height: '*', overflow: 'hidden'})),
      transition('inactive => active', [
        animate('500ms ease-in', style({height: '*', overflow: 'hidden'}))
      ]),
      transition('active => inactive', [
        animate('500ms ease-in', style({height: 0, overflow: 'hidden',}))
      ])
    ])
  ]
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
			this.scan(false); // Pass in false because this not a manual scan
		});
		this.events.subscribe('enteredGeofence:resetTrackerNotifications', () => {
			console.log("Entered geofence");

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

	private resetTrackerNotifications(): void {
		this.stackService.stacks.forEach(stack => {
			stack.trackerItems.forEach(tracker => {
				tracker.notified = false;
			});
		});
	}

	public isCurrentStack(): boolean{
		if(this.stackService.stacks){
			if(this.stackService.stacks.filter(stack => stack.isCurrent).length != 0){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public getCurrentStacks(): Array<Stack>{
		console.log("Num current stacks: " + this.stackService.stacks.filter(stack => stack.isCurrent).length)
		return this.stackService.stacks.filter(stack => stack.isCurrent);
	}

	public changeState(stack){
		stack.showItems = !stack.showItems;
		if(stack.currentState === 'inactive'){
			stack.currentState = 'active';
		} else {
			stack.currentState = 'inactive';
		}
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

	// Find if the tracker found is in one of the stacks
	private checkForDevice(device){
		const CURRENT_STACK_BENCHMARK: number = .25;
		let foundItems: number = 0;
		for(let stack of this.stackService.stacks){
			foundItems = 0;
			for(let tracker of stack.trackerItems){
				if(device.id === tracker.id){
					console.log("RSSI value of device: ", device.rssi);
					tracker.nearby = true;
					foundItems++;
				}
			}
			// Mark the stack as current if the user has enough items with them
			if((foundItems/stack.trackerItems.length) > CURRENT_STACK_BENCHMARK){
				stack.isCurrent = true;
			} else {
				stack.isCurrent = false;
			}
		}
	}

	private scan(isManualScan: boolean) {
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
					if(device.name === "tkr" || device.name === "ITAG"){
						this.checkForDevice(device);
						console.log("Found Tracker");
					}
					//loading.dismiss();
				}, error => console.log("Error when scanning", error)
			);
			setTimeout(() => {
				console.log("In the completion scanner code to send notification");
				this.ble.stopScan();
				//var forgottenItems: string = "";
				var currentStacks = this.getCurrentStacks();
				for(var i = 0; i < currentStacks.length; i++){
					var forgottenItems = new Array<string>(); 
					var counter: number = 0;
					for(let tracker of currentStacks[i].trackerItems){
						counter++;
						if(!tracker.nearby && !tracker.notified){
							/*this.localNotifications.schedule({
								id: 1,
								at: new Date(new Date().getTime()),
								title: "Missing itmes in " + this.stackService.currentStack.name,
								text: "We could't find " + tracker.name,
							});
							this.localNotifications.on('click', () => {
								console.log("User clicked the notification");
							});*/
							tracker.notified = true;
							forgottenItems.push(tracker.name);
						}
					}
					// Only send a notification if items were not found and it isn't a manual scan
					if(forgottenItems.length > 0 && !isManualScan){
						//this.events.publish('missingItems:stop');
						var missingItems: string = this.buildNotificationString(forgottenItems);
						console.log("going to schedule a notification");
						this.localNotifications.schedule({
							id: i,
							at: new Date(new Date().getTime()),
							title: "You're missing " + forgottenItems.length + " items!",
							text: "We could't find your " + missingItems,
						});
						this.localNotifications.on('click', () => {
							console.log("User clicked the notification");
						});
					}
				}
			}, 8000); // Scan for 8 seconds
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
