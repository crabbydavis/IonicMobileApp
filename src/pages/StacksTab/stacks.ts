/**
 * Generated class for the StacksTab page.
 *
 */

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Auth, User } from '@ionic/cloud-angular';

import { AlertController, PopoverController, List } from 'ionic-angular';

//Services
import { StackService } from '../../providers/stack-service/stack-service';

// import the model
import { Stack } from '../../model/stack';

@IonicPage()
@Component({
  selector: 'page-stacks',
  templateUrl: 'stacks.html',
})
export class StacksTab {
  @ViewChild(List) list: List;

	public stacks: Array<Stack>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public stackService: StackService, 
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StacksPage');
  }

  private isCurrent(stack: Stack): boolean{
    return this.stackService.isCurrent(stack)
  }

  private manageStack(stack): void {
    this.navCtrl.push('ManagePage', {param1: stack});
  }

  private removeStack(stack: Stack): void {
    this.stackService.removeStack(stack);
  }

  private makeCurrent(stack: Stack): void {
    let confirmAlert = this.alertCtrl.create({
    title: 'Make Current',
    message: 'Make ' + stack.name + ' the current stack?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          //confirmAlert.dismiss();
        }
      },
      {
        text: 'Yes',
        handler: () => {
          console.log('Buy clicked');
          this.stackService.makeCurrent(stack);
          // Try to go to current tab
          console.log("Trying to select first tab");
          // Close the sliding items that were open
          this.list.closeSlidingItems();
          this.navCtrl.parent.select(0);
        }
      }
    ]
    });
    confirmAlert.present();
  }

  private createStack(event): void {

    let prompt = this.alertCtrl.create({
      title: 'New Stack',
      message: "Enter a name for the new stack you want to keep track of.",
      inputs: [
        {
          name: 'stackName',
          placeholder: 'Stack Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          cssClass: 'save-button',
          handler: data => {
            console.log("name : " + data.stackName);
            console.log(data);
            var newStack = new Stack(data.stackName);
            console.log(newStack);
            this.stackService.addStack(newStack);
          }
        }
      ]
    });
    prompt.present();
  }
}
