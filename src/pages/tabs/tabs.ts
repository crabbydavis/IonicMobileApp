import { Component, ViewChild } from '@angular/core';
import { Tabs } from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = 'CurrentTab';
  tab2Root = 'StacksTab';
 
  constructor() {

  }
}
