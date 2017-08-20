import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
 
import {SettingsModel} from '../../models/settingsModel'
import {Settings} from '../../providers/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: SettingsModel = new SettingsModel();

  constructor(public navCtrl: NavController, settings: Settings) {
    this.user = settings.getSettings();
  }
}
