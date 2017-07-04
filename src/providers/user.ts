import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class User {
  
  private user_key: string = 'user_key';
  user_id: string;

  constructor(public storage: Storage) {
  }

  ready(){
    return this.storage.get(this.user_key);
  }

  login(){
    
  }

  logout(){
    this.storage.remove(this.user_key);
  }

  getUserId(){
    return this.user_id;
  }

  setUserId(user_id:string){
    return this.storage.set(this.user_key, user_id);
  }
}
