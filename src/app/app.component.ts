import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';

import { OmarksSettingsProvider } from '../providers/settings';
import { User } from '../providers/user';

import { SettingsModel } from '../models/settingsModel';
import { MenuSettings } from '../models/menuSettings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user: User;
  settingsProvider: OmarksSettingsProvider;
  userSettings : SettingsModel = new SettingsModel();

  pages: Array<MenuSettings>;

  constructor(public platform: Platform
  , public statusBar: StatusBar
  , public splashScreen: SplashScreen
  , settingsProvider: OmarksSettingsProvider, user: User) {
    
    this.user = user;
    this.settingsProvider = settingsProvider;
    this.initializeSettings();
    this.initializeApp();

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

  async initializeSettings(){
    //get user id
    var _uid = await this.user.ready();
    if (_uid != null)  {
      var _settings = await this.settingsProvider.ready(_uid);
      this.userSettings = _settings;
      this.pages = _settings.menu;
      this.rootPage = HomePage;
    } else {
      console.log('_uid null');
      this.rootPage = LoginPage;
      var _change = await this.settingsProvider.changeAuth();
      console.log(_change);
    }
  }  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, {
      key: page.key,
      value: page.value
    });
  }

  logOut(){
    this.user.logout();
    this.settingsProvider.clean();
    this.nav.setRoot(LoginPage);
  }
}
