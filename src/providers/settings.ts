import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import * as firebase from "firebase";

import {SettingsModel} from '../models/settingsModel';

@Injectable()
export class Settings {
    
    settings: SettingsModel = {
        uid: '',
        username: "",
        email: "",
        phoneNumber: "",
        profile_picture: "",
        algolia: {
            applicationId:"M90FC3UY18",
            apiKey:"10c0596a79389d1e359ea13707208c4a",
            index: "oMarks2"
        },
        menu: [
            { title: 'Readme Later', component: 'Home', key: "facets.tag", value: "read-me-later"}
          ]
    };

    constructor(public storage: Storage) {
    
        var config = {
            apiKey: "AIzaSyD96xf7ycKrwdxGqPMKyWDfh9O5U1_AsRE",
            authDomain: "omarks-b759c.firebaseapp.com",
            databaseURL: "https://omarks-b759c.firebaseio.com",
            projectId: "omarks-b759c",
            storageBucket: "omarks-b759c.appspot.com",
            messagingSenderId: "149578250050"
        };
        (!firebase.apps.length) && firebase.initializeApp(config);
    }

    async ready(uid: string){
        this.settings.uid = uid;
        var result = await firebase.database().ref("users/" + uid).once('value');
        var defaultSettings = this.settings;
        (result.val() != null) && (this.settings = result.val());
        (typeof (this.settings.menu) == 'undefined') && (this.settings.menu = defaultSettings.menu);
        return this.settings;
    }

    getSettings(){
        return this.settings;
    }

    async changeAuth (){
        // firebase.auth().onAuthStateChanged(user => {
        //     if(user){
        //         this.saveDefaultSettings(user);
        //     }
        // });

        firebase.auth().onAuthStateChanged((user => this.changeAuthSuccess(user)));
    }

    async changeAuthSuccess(user){
        if(user){
            console.log('onAuthStateChanged: ' + user.uid);
            var _settings = await this.ready(user.uid);
            console.log(_settings);
            if(_settings.uid == ""){
                this.saveDefaultSettings(user);
                window.location.reload();
            } else {
                this.storage.set("user_key", user.uid);
                this.settings = _settings;
            }
        }
    }

    setSettings(settings: SettingsModel){
        if(settings){
            this.settings = settings;
        } else {
            firebase.auth().onAuthStateChanged(user => {
                if(user){
                    // this.ready(user.uid).then(settings => {
                    //      console.log(settings.val());
                    //      (settings.val() == null) && this.saveDefaultSettings(user);
                    // })
                    this.saveDefaultSettings(user);
                }
            });
        }
        
    }

    saveDefaultSettings(user:any){
        this.storage.set("user_key", user.uid);

        this.settings.uid = user.uid;
        this.settings.username = user.displayName;
        this.settings.email = user.email;
        this.settings.profile_picture = user.photoURL;
        this.settings.phoneNumber = user.phoneNumber;

        firebase.database().ref("users/" + user.uid).set(this.settings);
    }

    saveSettings(settings:SettingsModel){
        return firebase.database().ref("users/" + this.settings.uid).set(settings);
    }

    clean(){
        firebase.auth().signOut();
    }
}
