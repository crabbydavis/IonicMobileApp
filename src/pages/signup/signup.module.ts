import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';


@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
  ],
  providers: [
    NativePageTransitions
  ],
  exports: [
    SignupPage
  ]
})
export class SignupPageModule {}
