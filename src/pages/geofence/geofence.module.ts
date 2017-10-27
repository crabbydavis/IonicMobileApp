import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeofencePage } from './geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';

@NgModule({
  declarations: [
    GeofencePage,
  ],
  imports: [
    IonicPageModule.forChild(GeofencePage),
  ],
  providers: [
      Geolocation, Geofence
  ],
  exports: [
    GeofencePage
  ]
})
export class EditPageModule {}