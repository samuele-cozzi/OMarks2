import { Component, ViewChild } from '@angular/core';
import { NavController, Searchbar } from 'ionic-angular';
 
import {SettingsModel} from '../../models/settingsModel'
import {Settings} from '../../providers/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchBar') searchBar: Searchbar;

  user: SettingsModel = new SettingsModel();
  showSearch: boolean = false;

  constructor(public navCtrl: NavController, settings: Settings) {
    this.user = settings.getSettings();
  }

  onInputSearch(event){
    console.log(event);
  }

  onCancelSearch(event){
    console.log(event);
    this.showSearch = false;
  }

  onClearSearch(event){
    console.log(event);
  }

  toogleSearchBar() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => { this.searchBar.setFocus(); });
    }
  }
}
