import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stack } from '../../model/stack';
import { StackItem, TrackerItem, ChecklistItem } from '../../model/stackItem';

import { AlertController } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';    

//Services
import { StackService } from '../../providers/stack-service/stack-service';

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
        animate('500ms ease-in', style({height: 0, overflow: 'hidden'}))
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
    public alertCtrl: AlertController) {
  	console.log('got stack: ' + this.stack);

    this.stack = this.navParams.get('param1');
    console.log(this.stack);
    if(this.stack.items.length > 0) {
      this.stackItems = this.stack.items;
    }
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

  private removeTrackerItem(){

  }

  private removeChecklistItem(){
    
  }

  private removeItem(item): void {

    var newStackItems = Array<StackItem>();
    for(var i in this.stack.items) {
      if(this.stack.items[i].name != item.name) {
        newStackItems.push(this.stack.items[i]);
      }
    }
    this.stack.items = newStackItems;
    //this.stackItems = newStackItems;

    var newTrackerItems = Array<StackItem>();
    for(var i in this.stack.trackerItems) {
      if(this.stack.items[i].name != item.name) {
        newStackItems.push(this.stack.items[i]);
      }
    }


    this.stackService.updateStack(this.stack);
  }

  private addNewStackItem(itemType: string): void {
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

}
