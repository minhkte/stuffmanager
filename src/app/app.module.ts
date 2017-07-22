import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyStuffsPage } from '../pages/my-stuffs/my-stuffs';
import { StuffHistoryPage } from '../pages/stuff-history/stuff-history';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TransferPage } from '../pages/modals/transfer/transfer';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';



export const firebaseConfig = {
  
  apiKey: "AIzaSyBLdiJjYPI4pMjbg3Jejr7m5-LIHYm0R_g",
  authDomain: "stuffmanager-ad763.firebaseapp.com",
  databaseURL: "https://stuffmanager-ad763.firebaseio.com",
  projectId: "stuffmanager-ad763",
  storageBucket: "stuffmanager-ad763.appspot.com",
  messagingSenderId: "429512166048"
};
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a636c9d6'
  },
  'auth': {
    'facebook': {
      'scope': []
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    MyStuffsPage,
    StuffHistoryPage,
    TabsControllerPage,
    LoginPage,
    SignupPage,
    TransferPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyStuffsPage,
    StuffHistoryPage,
    TabsControllerPage,
    LoginPage,
    SignupPage,
    TransferPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}