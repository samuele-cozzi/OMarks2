import {AlgoliaSettings} from './algoliaSettings';
import {MenuSettings} from './menuSettings';

export class SettingsModel {
    public uid: string;
    public username: string;
    public email: string;
    public profile_picture : string;
    public phoneNumber: string;
    
    public algolia: AlgoliaSettings = new AlgoliaSettings();
    
    public menu: MenuSettings[] = new Array<MenuSettings>(); 
    public menu_string?: string;

    public dashboard?: any[] = new Array();
    public dashboard_string?: string;
}