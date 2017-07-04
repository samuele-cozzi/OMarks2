import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import * as firebase from "firebase";

import {SettingsModel} from '../models/settingsModel';

@Injectable()
export class Settings {
    
    settings: SettingsModel = {
        username: "",
        email: "",
        phoneNumber: "",
        profile_picture: "",
        algolia: {
            applicationId:"aaa",
            apiKey:"bbb",
            index: "ccc"
        }
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
        firebase.initializeApp(config);
    }

    ready(uid: string){
        return firebase.database().ref("users/" + uid).once('value');
    }

    getSettings(){
        return this.settings;
    }

    setSettings(settings: SettingsModel){
        if(settings){
            this.settings = settings;
        } else {
            firebase.auth().onAuthStateChanged(user => {
                if(user){
                    this.saveDefaultSettings(user);
                }
            });
        }
        
    }

    saveDefaultSettings(user:any){
        this.storage.set("user_key", user.uid);

        this.settings.username = user.displayName;
        this.settings.email = user.email;
        this.settings.profile_picture = user.photoURL;
        this.settings.phoneNumber = user.phoneNumber;

        firebase.database().ref("users/" + user.uid).set(this.settings);
    }

    clean(){
        firebase.auth().signOut();
    }
}
