import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';

import {SplitPipe} from '../../pipes/split';
import {DashboardPipe} from '../../pipes/dashboard';


@NgModule({
  declarations: [
    HomePage
    ,SplitPipe
    ,DashboardPipe
  ],
  imports: [
    IonicPageModule.forChild(HomePage)
  ],
  entryComponents: [
    HomePage
  ]
})
export class HomePageModule { }