import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { HomePageModule } from '../pages/home/home.module';
import { SettingPage } from '../pages/setting/setting'
import { SettingPageModule } from '../pages/setting/setting.module'
import { EditItemPage } from '../pages/edit_item/edit_item';
import { LoginPage } from '../pages/login/login';


import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { AlgoliaService } from '../providers/algolia';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Deeplinks } from '@ionic-native/deeplinks';
//import { SettingsModel } from '../models/settingsModel';




@NgModule({
  declarations: [
    MyApp,
    EditItemPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EditItemPage,
    LoginPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlgoliaService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Settings, useFactory: (storage: Storage) => {return new Settings(storage);}, deps: [Storage] },
    {provide: User, useFactory: (storage: Storage) => {return new User(storage);}, deps: [Storage] }
  ]
})
export class AppModule {}
