import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyStuffsPage } from '../my-stuffs/my-stuffs';
import { StuffHistoryPage } from '../stuff-history/stuff-history';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MyStuffsPage;
  tab2Root: any = StuffHistoryPage;
  constructor(public navCtrl: NavController) {
  }
  
}
