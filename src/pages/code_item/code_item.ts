import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';

import {AlgoliaService} from '../../providers/algolia';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-code-item',
  templateUrl: 'code_item.html'
})
export class CodeItemPage implements OnInit{
  item_string: string;
  item: any; 

  constructor(private navCtrl: NavController
    , private navParams: NavParams
    , private toastCtrl: ToastController
    , private searchServices: AlgoliaService) {}

  ngOnInit(): void {
    this.item_string = this.navParams.get('item');
    this.item = JSON.parse(this.item_string);
  }

  save(){
    let request = JSON.parse(this.item_string);
    this.searchServices.save_item(request)
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
