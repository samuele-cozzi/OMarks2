import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';

import {AlgoliaService} from '../../providers/algolia';
import {HomePage} from '../home/home';
import {CodeItemPage} from '../code_item/code_item';

import { SettingsModel } from '../../models/settingsModel';
import { OmarksSettingsProvider } from '../../providers/settings';

@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit_item.html'
})
export class EditItemPage implements OnInit{
  item: any; 
  message: string = "";

  private user: SettingsModel = new SettingsModel();

  constructor(private navCtrl: NavController
    , private navParams: NavParams
    , private toastCtrl: ToastController
    , private searchServices: AlgoliaService
    , private settingsProvider: OmarksSettingsProvider) {

      this.user = settingsProvider.getSettings();
    }

  ngOnInit(): void {
    this.item = JSON.parse(this.navParams.get('item'));
  }

  save(){
    if (this.item.image == null && this.item.image_src != '')
    {
      this.item.has_image = 1;
      this.item.image = {
        src: this.item.image_src
      }
    }
    this.item['facets.tag'] = this.item.tags.split(',');

    this.item.time_read = Number.parseFloat(this.item.time_read);
    this.user.dashboard = [];
    this.settingsProvider.saveSettings(this.user);

    this.searchServices.save_item(this.item)
        .then(x => {
          let toast = this.toastCtrl.create({
            message: 'Saved!',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        })
        .catch(err => {
          let toast = this.toastCtrl.create({
            message: 'Error: ' + err,
            duration: 2000,
            position: 'top'
          });
          toast.present();
        });
  }

  star(){
    this.item.favorite = 1;
    this.searchServices.save_item(this.item)
        .then(x => {
          let toast = this.toastCtrl.create({
            message: 'Saved!',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        })
        .catch(err => {
          let toast = this.toastCtrl.create({
            message: 'Error: ' + err,
            duration: 2000,
            position: 'top'
          });
          toast.present();
        });
  }

  code(){
    this.navCtrl.push(CodeItemPage, {
      item: JSON.stringify(this.item, null, 2)
    });
  }

  delete(){
    this.searchServices.delete_item(this.item)
        .then(x => {
          let toast = this.toastCtrl.create({
            message: 'Saved!',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        })
        .catch(err => {
          let toast = this.toastCtrl.create({
            message: 'Error: ' + err,
            duration: 2000,
            position: 'top'
          });
          toast.present();
        });
  }
}
