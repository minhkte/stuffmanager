import { Component } from '@angular/core';
import { NavController, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController,public viewCtrl: ViewController) {
  }
  
  
  dismiss(){
    this.viewCtrl.dismiss();
  }
  
}
