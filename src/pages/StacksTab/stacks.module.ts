import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StacksTab } from './stacks';

@NgModule({
  declarations: [
    StacksTab,
  ],
  imports: [
    IonicPageModule.forChild(StacksTab),
  ],
  exports: [
    StacksTab
  ]
})
export class StacksPageModule {}
