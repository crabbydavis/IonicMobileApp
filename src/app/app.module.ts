import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { CurrentTab } from '../pages/CurrentTab/current';
import { StacksTab } from '../pages/StacksTab/stacks';
import { TabsPage } from '../pages/tabs/tabs';
import { MenuPage } from '../pages/menu/menu';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1b4e82cb'
  }
};

const firebaseConfig = {
    apiKey: "AIzaSyBm4SKx3ApL7LGJrVgFjZzNtg5pbGJiq4k",
    authDomain: "ionictrackerapp.firebaseapp.com",
    databaseURL: "https://ionictrackerapp.firebaseio.com",
    projectId: "ionictrackerapp",
    storageBucket: "ionictrackerapp.appspot.com",
    messagingSenderId: "14498595697"
  };

@NgModule({
  declarations: [
    MyApp,
    CurrentTab,
    StacksTab,
    TabsPage,
    MenuPage,
    LandingPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CurrentTab,
    StacksTab,
    TabsPage,
    MenuPage,
    LandingPage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
