import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';

import { Settings } from '../providers/settings';
import { User } from '../providers/user';

import { SettingsModel } from '../models/settingsModel';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user: User;
  settingsProvider: Settings;
  userSettings : SettingsModel = new SettingsModel();

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform
  , public statusBar: StatusBar
  , public splashScreen: SplashScreen
  , settingsProvider: Settings, user: User) {
    this.user = user;
    this.settingsProvider = settingsProvider;
    this.initializeSettings();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Settings', component: SettingPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('platform is ready!');

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initializeSettings(){
    this.user.ready().then(uid => {
      console.log(uid);
      this.user.login();
      this.settingsProvider.ready(uid).then(settings => {
        this.settingsProvider.setSettings(settings.val());
        this.rootPage = HomePage;
        this.userSettings = settings.val();
        console.log(settings.val());
      }).catch(error => {
        this.rootPage = LoginPage;
        console.log(error);
      });
    });
  }  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.user.logout();
    this.settingsProvider.clean();
    this.nav.setRoot(LoginPage);
  }
}
