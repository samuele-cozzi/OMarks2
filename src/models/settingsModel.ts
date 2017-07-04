import {AlgoliaSettings} from './algoliaSettings';

export class SettingsModel {
    public username: string;
    public email: string;
    public profile_picture : string;
    public phoneNumber: string;
    
    public algolia: AlgoliaSettings = new AlgoliaSettings();
}