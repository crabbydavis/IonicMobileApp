import { Component } from '@angular/core';

import { CurrentTab } from '../CurrentTab/current';
import { StacksTab } from '../StacksTab/stacks';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CurrentTab;
  tab2Root = StacksTab;
 
  constructor() {

  }
}
