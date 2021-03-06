import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

import {SettingsModel} from '../../models/settingsModel';
import { OmarksSettingsProvider } from '../../providers/settings';

@IonicPage({
  name: "Settings"
})
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage{

  settings:SettingsModel = new SettingsModel();
  errors:string='';

  constructor(private navCtrl: NavController
    , private toastCtrl: ToastController
    , private settingsProvider: OmarksSettingsProvider) {

      this.settings = settingsProvider.settings;
      this.settings.menu_string = JSON.stringify(this.settings.menu);
      this.settings.dashboard_string = JSON.stringify(this.settings.dashboard);
  }

  save(event){
    this.settings.menu = JSON.parse( this.settings.menu_string);
    this.settings.dashboard = JSON.parse( this.settings.dashboard_string);

    this.settingsProvider.saveSettings(this.settings).then(() => {
      let toast = this.toastCtrl.create({
        message: 'Saved!',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }).catch(error => {
      let toast = this.toastCtrl.create({    
        message: 'Error: ' + error.name + ', ' + error.message,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    })
  }

  refresh(event){
    window.location.reload();
  }
  
}
