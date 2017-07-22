import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stack } from '../../model/stack';
import { StackItem } from '../../model/stackItem';

import { AlertController } from 'ionic-angular';

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
})
export class ManagePage {

	private stackItems = Array<StackItem>();
	private stack = new Stack("");

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

  // Update the edits of the stack and then pop it off to go back to the stack screen
  updateStack() {

    this.stackService.updateStack(this.stack);
    this.navCtrl.pop();
  }

  removeItem(item) {

    var newStackItems = Array<StackItem>();
    for(var i in this.stack.items) {
      if(this.stack.items[i].name != item.name) {
        newStackItems.push(this.stack.items[i]);
      }
    }
    this.stack.items = newStackItems;
    //this.stackItems = newStackItems;
    this.stackService.updateStack(this.stack);
  }

  createStackItem() {
    let prompt = this.alertCtrl.create({
      title: 'New Item',
      message: "Enter a name for the new item you want to keep track of.",
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
          handler: data => {
            console.log("name : " + data.itemkName);
            console.log(data);
            var newStackItem = new StackItem(data.itemName);
            this.stack.items.push(newStackItem);
            //this.stack.items = this.stackItems
            console.log(newStackItem);
            //this.stackService.updateStack(this.stack);
          }
        }
      ]
    });
    prompt.present();
  }

}
