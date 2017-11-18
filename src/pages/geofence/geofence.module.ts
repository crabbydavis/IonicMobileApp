import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeofencePage } from './geofence';

@NgModule({
  declarations: [
    GeofencePage,
  ],
  imports: [
    IonicPageModule.forChild(GeofencePage),
  ],
  providers: [
  ],
  exports: [
    GeofencePage
  ]
})
export class EditPageModule {}