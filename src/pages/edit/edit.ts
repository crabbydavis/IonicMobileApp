import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EditPage page.
 */
@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  public itemName: string = "";
  private namePassedIn: string = "";
  public optionSelected: any;
  public type: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.itemName = this.navParams.get('name');
    this.namePassedIn = this.navParams.get('name');
    this.type = this.navParams.get('type');
    console.log("Got item name " + this.navParams.get('name'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  public cancel(){
    // Pass the original name back to the Manage Page
    this.viewCtrl.dismiss(this.namePassedIn);
  }

  public save() {
    // Pass the name back to Manage Page to update the item
    this.viewCtrl.dismiss(this.itemName);
  }
}
