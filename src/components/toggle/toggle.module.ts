import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ToggleComponent } from './toggle';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ToggleComponent,
  ],
  imports: [
    IonicModule,//BrowserAnimationsModule
  ],
  exports: [
    ToggleComponent
  ]
})
export class ToggleComponentModule {}
