import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class User {
  
  private user_key: string = 'user_key';
  user_id: string;

  constructor(public storage: Storage) {
  }

  ready(){
    var result = this.storage.get(this.user_key);
    return result;
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
