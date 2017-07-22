import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Auth, User, UserDetails } from '@ionic/cloud-angular';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';

import { TransferPage } from '../../pages/modals/transfer/transfer';




import { LoginPage } from '../../pages/login/login';




@Component({
  selector: 'page-my-stuffs',
  templateUrl: 'my-stuffs.html'
})
export class MyStuffsPage {
  scanData : {};
  userStuffUrl : string;
  firebaseUser: FirebaseObjectObservable<any>;
  listStuffUser: any[];

  options :BarcodeScannerOptions;
  
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(private app: App, public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private firebaseDB: AngularFireDatabase, public auth: Auth,public user: User,private toastCtrl: ToastController,private alertCtrl: AlertController,public modalCtrl: ModalController) {
    //Authentication check
    if (!this.auth.isAuthenticated()) {
        console.log("user is not authenticate, redirect to login page");
        this.app.getRootNav().setRoot(LoginPage);
        //this.navCtrl.setRoot(LoginPage);
    }
    else{
        console.log("user authenticated ");
        let userId = this.user.get('userId',"");
        console.log("userId :" + userId);
        this.doLoadData();
    }
    this.listStuffUser = []; 
  }
    
  doLoadData(){
    //this.userStuffUrl = '/users/' + this.user.get('userId',"/emty");
    //this.firebaseUser = this.firebaseDB.object(this.userStuffUrl);
    
    this.firebaseDB.list('/userStuff',{
        query:{
               orderByChild:'userId',
               equalTo: this.user.get('userId',"/emty")
        }
    }).subscribe(userStuffItems => {
            this.listStuffUser = [];
            console.log("doLoadData => called subscribe");
            userStuffItems.forEach(stuffUserItem => {
                console.log("item: " +  stuffUserItem.stuffId);
                let listUserStuff = this.firebaseDB.object('/stuffs/'+stuffUserItem.stuffId);
                listUserStuff.first().take(1).subscribe(snapshot => {
                    console.log(snapshot.name);
                    this.listStuffUser.push(snapshot.name);
                });
                
            })
        });
    
  }
  doTakeStuff(){
    console.log("take me");     
    //var mScanData = {serialNo:"12345-124",other:""};
    //var searchData = mScanData.serialNo;
    let self = this;
    this.presentPrompt(function(serialNo){
        self.doUpdateStuff(serialNo,"true");    
    });
    
    
    /*
    this.scanQrCode(function(data){
        console.log("data : " + data);
    });
    */
    /*
    this.firebaseDB.list('/stuffs').push(
    {
        des:"",
        other:"",
        price:"",
        serialNo:"12345-123",
        tag:"",
        uuid:""
    });
    */
    
  }
  doReleaseStuff(){
    console.log("release me");
    //test
    //this.doLogout();
    //this.firebaseDB.object('/stuffs/'+ item.$key).update({'status':"available"});
    let self = this;
    this.presentPrompt(function(serialNo){
        self.doUpdateStuff(serialNo,"false");    
    });
    //var mScanData = {serialNo:"12345-124",other:""};
    
  }
  
  scanQrCode(callback){
    this.options = {
        prompt : "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        console.log(barcodeData);
        this.scanData = barcodeData;
        callback(barcodeData);
    }, (err) => {
        console.log("Error occured : " + err);
    });
  };
  
  
  doUpdateStuff(searchData,isTake){
    
    const listStuffs = this.firebaseDB.list('/stuffs',{
        query:{
                orderByChild:'serialNo',
                equalTo:searchData,
                limitToFirst: 1
        }
    }).first();
    
    if(listStuffs!=undefined){
        
            listStuffs.subscribe(items => {
                items.forEach(item => {
                    console.log('Item:', item);
                    //Add to user list. 
                    //this.firebaseUser.get('onholdStuff');
                    if(isTake == "true"){         
                        if(item.status == 'available'){
                            (this.firebaseDB.list('/userStuff') as FirebaseListObservable<any>).push({stuffId:item.$key, userId:this.user.get('userId',"empty")});
                            this.firebaseDB.object('/stuffs/'+ item.$key).update({'status':"onhold"});
                        }
                        else{
                        
                            this.doToast("Not available");
                        }
                    }
                    else{
                        this.firebaseDB.list('/userStuff',{
                            query:{
                               orderByChild:'stuffId',
                               equalTo: item.$key,
                               limitToFirst: 1

                            }
                        }).first().subscribe(userStuffItems => {
                            userStuffItems.forEach(stuffUserItem => {
                                console.log('Item:', stuffUserItem);
                                if(stuffUserItem.stuffId == item.$key &&    stuffUserItem.userId==this.user.get('userId',"empty")){
                                    console.log("Do release now");
                                    this.firebaseDB.object('/stuffs/'+ item.$key).update({'status':"available"});
                                    this.doToast("Successfully release");
                                    console.log("Do remove item now");
                                    
                                    (this.firebaseDB.list('/userStuff') as FirebaseListObservable<any>).remove(stuffUserItem.$key).then(_ => console.log('item deleted!'));
                                    
                                }
                            });
                        });
                        
                    }
                                        
            });

        });
    }
  };
  doToast(pMessage){
    let toast = this.toastCtrl.create({
            message: pMessage,
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
        console.log(pMessage);
  }
  
  doLogout(){
    if (this.auth.isAuthenticated()) {
        this.auth.logout();
        this.app.getRootNav().setRoot(LoginPage);
    }
  
  }
  doTransfer(){
    console.log("Do transfer now");
    this.presentModal();
    
  
  }
  
  presentModal() {
    let modal = this.modalCtrl.create(TransferPage);
    modal.present();
  };

  
  //Test: 
  presentPrompt(confirmHandler) {
      let alert = this.alertCtrl.create({
        title: 'Input',
        inputs: [
          {
            name: 'serialNumber',
            placeholder: 'S/N'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
                confirmHandler(data.serialNumber);
            }
          }
        ]
      });
      alert.present();
    }
}
