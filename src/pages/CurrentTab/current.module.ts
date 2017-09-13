import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentTab } from './current';

@NgModule({
  declarations: [
    CurrentTab,
  ],
  imports: [
    IonicPageModule.forChild(CurrentTab),
  ],
  exports: [
    CurrentTab
  ]
})
export class CurrentPageModule {}
