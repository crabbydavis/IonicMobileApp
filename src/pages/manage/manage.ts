import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ItemSliding, LoadingController, Events } from 'ionic-angular';
import { Stack } from '../../model/stack';
import { StackItem, TrackerItem, ChecklistItem } from '../../model/stackItem';

import { AlertController } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';    
import { BLE } from '@ionic-native/ble';

//Services
import { StackService } from '../../providers/stack-service/stack-service';
import { IBeacon } from '@ionic-native/ibeacon';
import { IbeaconProvider } from '../../providers/ibeacon/ibeacon';

/**
 * Generated class for the LandingPage page.
 *
 */

@IonicPage()
@Component({
  selector: 'page-manage',
  templateUrl: 'manage.html',
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
export class ManagePage {

	private stackItems = Array<StackItem>();
  private stack = new Stack("");
  private addItem: boolean = false;
  private addItemState: string = 'inactive';
  private trackerState: string = 'active';
  private checklistState: string = 'active';
  private showTracker: boolean = true;
  private showChecklist: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public stackService: StackService, 
    public alertCtrl: AlertController, private ble: BLE, private modalCtrl: ModalController, private loadingCtrl: LoadingController,
    private ibeacon: IBeacon, private ibeaconProvider: IbeaconProvider, private events: Events) {
  	console.log('got stack: ' + this.stack);

    this.stack = this.navParams.get('param1');
    console.log(this.stack);
    if(this.stack.items.length > 0) {
      this.stackItems = this.stack.items;
    }

    this.events.subscribe('foundBeacon:setupName', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log("Found beacon, going to get name");
      this.getItemName('Tracker');
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagePage');
    
  }

  ionViewWillLeave() {
    // Update the stack just before it is no longer the active view
    this.stackService.updateStack(this.stack);
  }

  private changeAddItemState(): void {
    console.log(this.addItemState);
    this.addItem = !this.addItem;
    if(this.addItemState === 'inactive'){
      this.addItemState = 'active';
    } else {
      this.addItemState = 'inactive';
    }
  }

  private changeTrackerState(): void {
    console.log(this.trackerState);
    this.showTracker = !this.showTracker;
    if(this.trackerState === 'inactive'){
      this.trackerState = 'active';
    } else {
      this.trackerState = 'inactive';
    }
  }

  private changeChecklistState(): void {
    this.showChecklist = !this.showChecklist;
    if(this.checklistState === 'inactive'){
      this.checklistState = 'active';
    } else {
      this.checklistState = 'inactive';
    }
  }

  // Update the edits of the stack and then pop it off to go back to the stack screen
  private updateStack(): void {

    this.stackService.updateStack(this.stack);
    this.navCtrl.pop();
  }

  // Implement this and make sure it works
  private removeItem(trackerToDelete, itemSliding: ItemSliding, type:string){
    itemSliding.close();
    const deleteAlert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            if(type === 'tracker'){
              for(let i = 0; i < this.stack.trackerItems.length; i++){
                if(this.stack.trackerItems[i].name === trackerToDelete.name){
                  this.stack.trackerItems.splice(i, 1);
                  break;
                }
              }
            } else {
              for(let i = 0; i < this.stack.checklistItems.length; i++){
                if(this.stack.checklistItems[i].name === trackerToDelete.name){
                  this.stack.checklistItems.splice(i, 1);
                  break;
                }
              }
            }
          }
        }
      ]
    });
    deleteAlert.present();
  }

  public editItem(item, slidingItem: ItemSliding) {
    slidingItem.close();
    let editModal = this.modalCtrl.create('EditPage', {name: item.name, type: 'Item'});
    editModal.present();
    editModal.onDidDismiss(res => {
      console.log("passed back: ", res);
      item.name = res;
    });
  }
  /*
  public removeItem(item): void {

    var newStackItems = Array<StackItem>();
    for(var i in this.stack.items) {
      if(this.stack.items[i].name != item.name) {
        newStackItems.push(this.stack.items[i]);
      }
    }
    this.stack.items = newStackItems;
    //this.stackItems = newStackItems;

    var newTrackerItems = Array<StackItem>();
    for(var x in this.stack.trackerItems) {
      if(this.stack.items[x].name != item.name) {
        newStackItems.push(this.stack.items[x]);
      }
    }


    this.stackService.updateStack(this.stack);
  }
  */
  private addNewStackItem(itemType: string): void {

    switch(itemType){
      case 'Checklist': 
        this.getItemName(itemType);
        break;
      case 'Tracker': 
        var foundTracker: boolean = false;
        // Create a loading spinner the user that the app is scanning for a tracker
        let loading = this.loadingCtrl.create({
          content: 'Finding Beacon...'
        }); 
        loading.present(); // Show spinner just before starting to scan
        // Start scanning for a tracker now that the loading controller has shown
        console.log("Start Scanning");
        
        //this.ibeaconProvider.beacons[0].region
        var region = this.ibeacon.BeaconRegion('universalRegion', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D');

        this.ibeacon.startRangingBeaconsInRegion(region).then(res => {
            console.log("Started ranging Beacons: ", res); 
        }).catch(err => console.log("Not able to range for beacons ", err));

        setTimeout(() => {
          this.ibeacon.stopRangingBeaconsInRegion(region).then(res => {
            console.log("Stopped ranging beacons: ", res);
            loading.dismiss(); // Dismiss the loading spinner
          }).catch(err => console.log("Issue with Stopped ranging for beacons ", err));
        }, 5000); // The timeout is 5 sec.
        /*
        this.ble.startScan([]).subscribe(device => {
          if(device.name === "ITAG" || device.name === "tkr" || device.name === "Tile"){
            console.log(device);
            if(!this.alreadyInStack(device.id)){
              foundTracker = true;
              this.ble.stopScan(); // Stop the scan since we found a tag
              loading.dismiss(); // Dismiss the loading spinner
              this.getItemName(itemType, device.id); // Now get the name for the tracker
            }
          }
        });
        setTimeout(() => {
          this.ble.stopScan().then(() => {
            console.log("Stopped Scan");
            if(!foundTracker){
              this.displayNoTracker();
              loading.dismiss(); // Dismiss the loading spinner
            }
          });
        }, 5000); // The timeout is 5 sec.
        */
        break;
      default:
        console.log("Error: Invalid Item Type");
    }
  }

  // This will get the name for a tracker or checklist item
  // The id is an optional because the checklist item doesn't need an id
  private getItemName(itemType: string, idPassedIn?: any): void {
    let prompt = this.alertCtrl.create({
      title: 'New Stack Item',
      message: "Enter a name for the new " + itemType + " item you want to keep track of.",
      inputs: [
        {
          name: 'itemName',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (res) => {
            //var newStackItem;
            switch(itemType){
              case 'Checklist': 
                var newChecklistItem = new ChecklistItem(res.itemName);
                console.log(newChecklistItem);
                this.stack.checklistItems.push(newChecklistItem);
                this.stack.items.push(newChecklistItem);
                break;
              case 'Tracker': 
                var newTrackerItem = new TrackerItem(res.itemName);
                newTrackerItem.id = idPassedIn;
                console.log(newTrackerItem);
                console.log(this.stack);
                this.stack.trackerItems.push(newTrackerItem);
                this.stack.items.push(newTrackerItem);
                break;
              default:
                console.log("Error: Invalid Item Type");
            }
            this.stackService.updateStack(this.stack);
            //this.stack.items.push(newStackItem);
          }
        }
      ]
    });
    prompt.present();
  }

  // Check to see if a tracker is already in the stack
  private alreadyInStack(id: string): boolean{
    for(var i = 0; i < this.stack.trackerItems.length; i++){
      if(id === this.stack.trackerItems[i].id){
        return true;
      }
    }
    return false;
  }

  private displayNoTracker(): void {
    const alert = this.alertCtrl.create({
      title: 'No Tracker Found',
      subTitle: 'Please make sure a tracker is on and close to the device',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
