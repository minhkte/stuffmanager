import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Auth, User, UserDetails } from '@ionic/cloud-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { SignupPage } from '../../pages/signup/signup';

import { TabsControllerPage } from '../../pages/tabs-controller/tabs-controller';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string;
  password: string;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController, public auth: Auth, public user: User, public alertCtrl: AlertController, public loadingCtrl: LoadingController,public firebaseDB: AngularFireDatabase) {
    
  }
  
  doSignIn(type){
  
    let loader = this.loadingCtrl.create({
      content: "Logging in..."
    });

    loader.present();

    setTimeout(() => {
      loader.dismiss();
    }, 5000);
    
    if(type == 'email'){
        let details: UserDetails = {
        'email': this.email,
        'password': this.password
      };

      this.auth.login('basic', details).then((res) => {

        loader.dismiss();
        //this.email = '';
        //this.password = '';
        //this.navCtrl.push(UserPage);
        console.log("login ok " + this.email);
        const itemObservable = this.firebaseDB.list('/users',{
            query:{
                orderByChild:'email',
                equalTo:this.email
            }
        });
        
        if(itemObservable!=undefined){
        
            itemObservable.subscribe(items => {
                items.forEach(item => {
                    console.log('Item:', item);
                    this.user.set('userId',item.$key);
                    this.user.save();
            });

        });
    }
        
        
        this.navCtrl.setRoot(TabsControllerPage);

      }, (err) => {

        loader.dismiss();
        this.email = '';
        this.password = '';
        let alert = this.alertCtrl.create({
          title: "Invalid Credentials.",
          subTitle: 'Please try again.',
          buttons: ['OK']
        });
        alert.present();

      });
    };

  }
  navSignUp(){
    //this.navCtrl.setRoot(SignupPage);
    this.navCtrl.push(SignupPage);
  }
  
  
}
