import { Component, ViewChild, HostListener } from '@angular/core';
import { IonicPage, NavController, Searchbar, ToastController, NavParams } from 'ionic-angular';

import { SettingsModel } from '../../models/settingsModel';
import { Marks } from '../../models/marks';
import { EditItemPage } from '../edit_item/edit_item';
import { Settings } from '../../providers/settings';
import { AlgoliaService } from '../../providers/algolia';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
@IonicPage({
  name: "Home"
})

export class HomePage {
  @ViewChild('searchBar') searchBar: Searchbar;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.key == 'Backspace' && event.isTrusted && event.ctrlKey) {
      this.toDashboard();
    }
    if (event.key == 'Enter' && event.isTrusted && event.ctrlKey) {
      this.toogleSearchBar();
    }
    if (event.key == 'Enter' && event.isTrusted && !event.ctrlKey) {
      if(this.searchItems.length > 0){
        this.open(this.searchItems[0], null);
      }
    }
  }

  private showSearch: boolean = false;
  private page: number = 0;
  private query: string = "";
  private key: string = "";
  private value: string = "";
  user: SettingsModel = new SettingsModel();

  dashboardItems: any[] = [];
  searchFacets: any[] = [];
  searchItems: any[] = [];

  /* IONIC Lifecycle app */
  /**
   * 
   * @param navCtrl 
   * @param settings 
   * @param algolia 
   */
  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    settings: Settings,
    private algoliaService: AlgoliaService) {

    this.user = settings.getSettings();
    this.key = navParams.get('key');
    this.value = navParams.get('value');
  }

  /**
   * 
   */
  ionViewDidLoad() {
    if (this.key !== undefined && this.value !== undefined) {
      this.getSearchFacets(this.key, this.value);
      this.showSearch = true;
    } else {
      this.getDashboard();
    }
  }

  /* HEADER_EVENTS */
  onInputSearch(event) {
    console.log(event);
    (event.inputType === "insertText") && (event.target.value !== "") && this.getSearch(event.target.value, 0);
    (event.inputType === "deleteContentBackward") && (event.target.value === "") && (this.searchItems = []);
  }

  onCancelSearch(event) {
    console.log(event);
    this.showSearch = false;
    this.searchItems = [];
  }

  onClearSearch(event) {
    console.log(event);
    this.searchItems = [];
  }

  toogleSearchBar() {
    this.getFacets();
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => { this.searchBar.setFocus(); });
    }
  }
  
  toDashboard() {
    this.getFacets();
    this.showSearch = false;
  }

  /* Toast functions */
  toastError(err) {
    let toast = this.toastCtrl.create({
      message: 'Error: ' + err,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  toastSavedDashboard() {
    let toast = this.toastCtrl.create({
      message: 'Saved!',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    setTimeout(() => {
      this.getDashboard();
    }, 3000);
  }


  getDashboard() {
    this.algoliaService.get_dashboard().then(items => { this.dashboardItems = items });
  }

  getFacets() {
    this.algoliaService.get_facets().then(items => {
      this.searchItems = [];
      this.searchFacets = items;
    });
  }

  async getSearch(query, page) {
    (this.query != query) && (this.initParams());
    this.query = query;
    var items = await this.algoliaService.get_query(query, 20, page).then();
    for (var i = 0; i < items.length; i++) {
      this.searchItems.push(items[i]);
    }
    return items.length;
  }

  async getSearchFacets(key, value) {
    (this.key != key || this.value != value) && (this.initParams());
    this.key = key;
    this.value = value;
    var items = await this.algoliaService.get_filtered_facets(key, value, 20, this.page).then();
    for (var i = 0; i < items.length; i++) {
      this.searchItems.push(items[i]);
    }
    return items.length;
  }

  private initParams() {
    this.searchItems = [];
    this.page = 0;
  }

  async doInfinite(infiniteScroll) {
    if (this.searchItems.length > 0) {
      this.page++;
      var newItemsLength = 0;
      console.log('Begin async operation: ' + this.page);
      if (this.query.trim() != '') {
        newItemsLength = await this.getSearch(this.query, this.page);
        (newItemsLength == 0) && infiniteScroll.enable(false);
        infiniteScroll.complete();
      }
      else if (this.key != "" && this.value != "") {
        newItemsLength = await this.getSearchFacets(this.key, this.value);
        (newItemsLength == 0) && infiniteScroll.enable(false);
        infiniteScroll.complete();
      }
    }
    else {
      infiniteScroll.complete();
    }
  }

  /* DASHBOARD EVENTS */
  open(item, event) {
    typeof item.time_read == "string" && (item.time_read = 0);
    item.time_read++;
    this.algoliaService.save_item(item);
    window.open(item.given_url)
  }

  create(item) {
    this.navCtrl.push(EditItemPage, {
      item: JSON.stringify(new Marks(), null, 2)
    });
  }

  edit(item) {
    this.navCtrl.push(EditItemPage, {
      item: JSON.stringify(item, null, 2)
    });
  }

  up(item) {
    item.time_read++;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  down(item) {
    item.time_read--;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  add_star(item) {
    item.favorite = 1;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  remove_star(item) {
    item.favorite = 0;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  delete(item) {
    this.algoliaService.delete_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  /* SEARCH EVENTS */


}
