import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { EditItemPage } from '../pages/edit_item/edit_item';
import { LoginPage } from '../pages/login/login';
import { SettingPage} from '../pages/setting/setting'

import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { AlgoliaService } from '../providers/algolia';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsModel } from '../models/settingsModel';

import {SplitPipe} from '../pipes/split';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditItemPage,
    LoginPage,
    SettingPage,
    SplitPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditItemPage,
    LoginPage,
    SettingPage
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
