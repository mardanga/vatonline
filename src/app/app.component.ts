import { VatsimService } from './../services/vatsim.service';
import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from 'ionic-native';

import { RegistroPage, TabsPage } from '../pages/index.pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  constructor(
    private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private vatsimSrv: VatsimService,
    private toastCtrl: ToastController
) {
    if(!this.platform.is('mobile')){
     if(this.vatsimSrv.getIdUsuario() != 0)
        {
          this.rootPage = TabsPage;
        }
        else
        {
          this.rootPage = RegistroPage;
        }
    }
    else
    {
      platform.ready().then(() => {
        statusBar.styleDefault();

        let type = Network.type;
        if(type == "unknown" || type == "none" || type == undefined){
          //console.log("The device is not online");
          this.vatsimSrv.setOnlineInfo(false);
        }
        else
        {
          this.vatsimSrv.setOnlineInfo(true);
        }
      

        Network.onConnect().subscribe(data => {
          console.log(data)
          this.vatsimSrv.setOnlineInfo(true);
        }, error => console.error(error));
 
        Network.onDisconnect().subscribe(data => {
          console.log(data)
          this.vatsimSrv.setOnlineInfo(true);
        }, error => console.error(error));
        
        if(this.vatsimSrv.getIdUsuario() != 0)
        {
          this.rootPage = TabsPage;
        }
        else
        {
          this.rootPage = RegistroPage;
        }
        splashScreen.hide();
   
        //back button
        var lastTimeBackPress = 0;
        var timePeriodToExit  = 2000;
        /*platform.registerBackButtonAction(() => {
            // get current active page
            let view = this.nav.getActive();
            console.log(view);
            if (view.component.name == "TabsPage") {
                //Double check to exit app
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    this.platform.exitApp(); //Exit from app
                } else {
                    let toast = this.toastCtrl.create({
                        message:  'Presiona nuevamente para salir de la App',
                        duration: 2000,
                        position: 'bottom'
                    });
                    toast.present();
                    lastTimeBackPress = new Date().getTime();
                }
            } else {
                // go to previous page
                this.nav.pop({});
            }
        });
        */

      });
    }
  }
}
