import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CurrentTab } from '../CurrentTab/current'

/**
 * Generated class for the MenuPage page.
 *
 */
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

	rootPage = TabsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCurrent() {

  	//this.rootPage = TabsPage.CurrentTab;
  }

  openStacks() {
  	//this.rootPage = 
  }

}
