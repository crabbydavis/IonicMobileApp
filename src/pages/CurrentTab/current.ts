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
import { NativeStorage } from '@ionic-native/native-storage';
import { IbeaconProvider } from '../../providers/ibeacon/ibeacon';

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
	//public scanning: boolean = false;
	private readonly CURRENT_STACK_BENCHMARK: number = .5; // percentage of items w/ user to be considered a current stack
	private readonly LOWER_RSSI_LIMIT: number = -90; // The closer to 0, the stronger the signal

	public radius: number;
	public distance: number;
	public accuracy: number;

	constructor(private navCtrl: NavController, private navParams: NavParams, private stackService: StackService, 
		private ble: BLE, private loadingCtrl: LoadingController, private statusbar: StatusBar, private events: Events,
		private localNotifications: LocalNotifications, private nativeStorage: NativeStorage, private ibeaconProvider: IbeaconProvider) {
	  
		this.events.subscribe('outsideGeofence:scan', () => {
			// user and time are the same arguments passed in `events.publish(user, time)`
			console.log("Going to ");
			this.checkToNotify();
			this.ibeaconProvider.beacons.forEach(beacon => {

			});
		});
		this.events.subscribe('enteredGeofence:resetTrackerNotifications', () => {
			console.log("Entered geofence");
			this.resetTrackerNotifications();
		});
		this.events.subscribe('newData:updateUI', (radius, distance, accuracy) => {
			this.radius = radius;
			this.distance = distance;
			this.accuracy = accuracy;
		});
	}	

	private checkToNotify(){
		var forgottenItems = new Array<string>(); 
		//var counter: number = 0;
		this.ibeaconProvider.beacons.forEach(beacon => {
			//counter++;
			if(!tracker.nearby && !tracker.notified){
				//console.log("Forgot an item: " + counter);
				this.localNotifications.schedule({
					id: 1,
					at: new Date(new Date().getTime()),
					title: "Missing itmes in " + this.stackService.currentStack.name,
					text: "We could't find " + tracker.name,
				});
				this.localNotifications.on('click', () => {
					console.log("User clicked the notification");
				});
				console.log(tracker.id + " isn't nearby and will send notification");
				tracker.notified = true;
				forgottenItems.push(tracker.name);
			} else if(!tracker.nearby){
				console.log(tracker.id + " isn't nearby but has been notified");
				//alert();
			}
		});
		// Only send a notification if items were not found and it isn't a manual scan
		if(forgottenItems.length > 0){
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
}

  	ionViewDidLoad() {
		console.log('ionViewDidLoad CurrentPage');
		this.statusbar.styleLightContent();
	}
	
	ionViewWillLeave() {
		console.log("In will leave");
		//this.scanning = false;
	}

	ionViewWillUnload() {
		//this.scanning = false;
	}

	/*
	private getUUIDs(): Array<string> {
		var uuids: Array<string> = [];
		this.stackService.stacks.forEach(stack => {
			stack.trackerItems.forEach(tracker => {
				uuids.push(tracker.id);
			});
		});
		return uuids;
	}
	*/

	private resetTrackerNotifications(): void {
		console.log("Reset tracker notifications");
		this.stackService.stacks.forEach(stack => {
			stack.trackerItems.forEach(tracker => {
				tracker.notified = false;
			});
		});
	}

	public isCurrentStack(): boolean{
		return true;
		/*if(this.stackService.stacks){
			if(this.stackService.stacks.filter(stack => stack.isCurrent).length != 0){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}*/
	}

	public getCurrentStacks(): Array<Stack>{
		//console.log("Num current stacks: " + this.stackService.stacks.filter(stack => stack.isCurrent).length)
		return this.stackService.stacks;//this.stackService.stacks.filter(stack => stack.isCurrent);
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

	// Reset trackers to be not found
	private resetDevicesFound(){
		/*var currentStacks = this.getCurrentStacks();
		currentStacks.forEach(stack => {
			stack.trackerItems.forEach(tracker => {
				tracker.nearby = false;
			});
		});*/
		this.stackService.stacks.forEach(stack => {
			stack.trackerItems.forEach(tracker => {
				tracker.nearby = false;
			});
		});
	}

	/*
	// Find if the tracker found is in one of the stacks
	private checkForDevice(device){
		//this.stackService.getStacks(); // Get the stacks out of native storage
		console.log("Checking for Tracker/Itag in group");		
		let foundItems: number = 0;
		for(let stack of this.stackService.stacks){
			foundItems = 0;
			for(let tracker of stack.trackerItems){
				if(!tracker.nearby){
					if(device.id === tracker.id /*&& device.rssi > this.LOWER_RSSI_LIMIT){
						console.log("RSSI value of " + tracker.name +  "=" + device.rssi);
						tracker.nearby = true;
						tracker.notified = false; // Reset the notification since it has been found
						tracker.rssi = device.rssi;
						foundItems++;
					}
				}
			}
			// Mark the stack as current if the user has enough items with them
			if(stack.trackerItems.length === 1 || (foundItems/stack.trackerItems.length) > this.CURRENT_STACK_BENCHMARK){
				console.log("Marking stack as current");
				stack.isCurrent = true;
			} else {
				stack.isCurrent = false;
			}
		}
		this.stackService.updateAllStacks(); // Update the stacks in storage
	}
	*/

	//private manualScan()

	/*
	private scan(isManualScan: boolean) {
		this.scanning = true;
		this.ble.isEnabled().then(result => {
			console.log("Bluetooth is enabled: " + result);
			this.scanning = true;
			this.resetDevicesFound(); // Reset the devices to not found before scanning
			// tkr 0F3E
			// ITAG 1802, FF0E
			this.ble.startScan(["0F3E"//, "1802","FF0E"]).subscribe(
				device => {
					//console.log(device);
					if(device.name === "tkr" || device.name === "ITAG"){
						this.checkForDevice(device);
					}
				}, error => console.log("Error when scanning", error)
			);
			setTimeout(() => {
				console.log("stop scanning");
				this.ble.stopScan();
				//var forgottenItems: string = "";
				var currentStacks = this.getCurrentStacks();
				for(var i = 0; i < currentStacks.length; i++){
					var forgottenItems = new Array<string>(); 
					//var counter: number = 0;
					for(let tracker of currentStacks[i].trackerItems){
						//counter++;
						if(!tracker.nearby && !tracker.notified){
							//console.log("Forgot an item: " + counter);
							/*this.localNotifications.schedule({
								id: 1,
								at: new Date(new Date().getTime()),
								title: "Missing itmes in " + this.stackService.currentStack.name,
								text: "We could't find " + tracker.name,
							});
							this.localNotifications.on('click', () => {
								console.log("User clicked the notification");
							});
							console.log(tracker.id + " isn't nearby and will send notification");
							tracker.notified = true;
							forgottenItems.push(tracker.name);
						} else if(!tracker.nearby){
							console.log(tracker.id + " isn't nearby but has been notified");
							//alert();
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
			}, 20000); // Scan for 8 seconds
		}).catch(err => {
			console.log("Bluetooth is not enabled", err);
		});		
	}
	*/

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
		if(!item.nearby){
			return true;
		} else {
			return false;
		}
	}

	public isNearby(item): string{
		if(item.nearby) {
			return '#00c6a7';
		} else {
			return '#cf502a';
		}
	}
}
