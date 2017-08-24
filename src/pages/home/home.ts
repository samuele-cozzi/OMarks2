import { Component, ViewChild } from '@angular/core';
import { NavController, Searchbar, ToastController } from 'ionic-angular';
 
import {SettingsModel} from '../../models/settingsModel'
import {Settings} from '../../providers/settings';
import {AlgoliaService} from '../../providers/algolia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchBar') searchBar: Searchbar;
  
  showSearch: boolean = false;
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
    private toastCtrl: ToastController, 
    settings: Settings, 
    private algoliaService: AlgoliaService) {
    
      this.user = settings.getSettings();
  }

  /**
   * 
   */
  ionViewDidLoad() {
    this.getDashboard();
  }

  /* HEADER_EVENTS */
  onInputSearch(event){
    console.log(event);
    (event.inputType === "insertText") && (event.target.value !== "") && this.getSearch(event.target.value, 0);
    (event.inputType === "deleteContentBackward") && (event.target.value === "") && (this.searchItems = []);
  }

  onCancelSearch(event){
    console.log(event);
    this.showSearch = false;
    this.searchItems = [];
  }

  onClearSearch(event){
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


  getDashboard(){
    this.algoliaService.get_dashboard().then(items => { this.dashboardItems = items });
  }

  getFacets(){
    this.algoliaService.get_facets().then(items => {
      this.searchItems = [];
      this.searchFacets = items;
    });
  }

  getSearch(query, page){
    this.algoliaService.get_query(query, 20, page).then(items => {
      this.searchItems = items;
    });
  }

  /* DASHBOARD EVENTS */
  open(item,event){
    typeof item.time_read == "string" && (item.time_read = 0);
    
    this.algoliaService.save_item(item);
    window.open(item.given_url)
  }

  // create(item){
  //     this.navCtrl.push(EditItemPage, {
  //         item:  JSON.stringify(new Marks(), null, 2)
  //     });
  // }

  // edit(item){
  //   this.navCtrl.push(EditItemPage, {
  //     item: JSON.stringify(item, null, 2)
  //   });
  // }

  // editCode(item){
  //   this.navCtrl.push(CodeItemPage, {
  //       item: JSON.stringify(item, null, 2)
  //   });
  // }

  up(item){
    item.time_read ++;
    this.algoliaService.save_item(item)
        .then(x => this.toastSavedDashboard())
        .catch(err => this.toastError(err));
  }

  down(item){
    item.time_read --;
    this.algoliaService.save_item(item)
        .then(x => this.toastSavedDashboard())
        .catch(err => this.toastError(err));
  }

  add_star(item){
    item.favorite = 1;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  remove_star(item){
    item.favorite = 0;
    this.algoliaService.save_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
  }

  delete(item){
    this.algoliaService.delete_item(item)
      .then(x => this.toastSavedDashboard())
      .catch(err => this.toastError(err));
}

  /* SEARCH EVENTS */


}
