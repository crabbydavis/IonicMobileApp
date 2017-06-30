import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

// Ionic Native Imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BLE } from '@ionic-native/ble';

import { IonicStorageModule } from '@ionic/storage';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { StackService } from '../providers/stack-service/stack-service';

// This is for the ionic cloud services. Connects the app to my account
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1b4e82cb'
  }
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot({
      name: 'stacks.db'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen, BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StackService
  ]
})
export class AppModule {}
