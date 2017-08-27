import { Push, PushToken } from '@ionic/cloud-angular';
import { TabsPage } from './../tabs/tabs';
import { IUsuario } from './../../clases/usuario';
import { Component } from '@angular/core';
import { Platform, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

//servicios
import { VatsimService} from '../../services/vatsim.service';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})

export class RegistroPage {

  constructor(
    private vatsimSrv : VatsimService,
    public loadingCtrl: LoadingController,
    private navCtrl:NavController,
    private push: Push,
    private plt: Platform,
    private toastCtrl: ToastController,
    private network: Network
  ) {
  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));
  
    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));
  }


  user:IUsuario={
    cid:null,
    mail:"",
    id:0,
    idDevice:"testing"
  };

  registrar(){
    if(!this.vatsimSrv.getOnlineInfo())
    {
      this.showToast("No hay conexion a internet");
      return
    }

    let loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();
    
    //this.user.idDevice= "preuba";
    //console.log(this.user);
    if(!this.plt.is('cordova')){
        
    //this.user.mail= "testing@testingcom";
        this.vatsimSrv.registrar(this.user).subscribe(
          data=> {
            this.vatsimSrv.setIdUsuario(data);   
            this.navCtrl.push(TabsPage);
            loading.dismiss();
        });
    }
    else{
      this.push.register().then((t: PushToken) => {

          return this.push.saveToken(t);
        }).then((t: PushToken) => {
          //console.log('Token saved:', t.token);
          this.user.idDevice = t.token;
          this.vatsimSrv.registrar(this.user).subscribe(
            data=> {
              this.vatsimSrv.setIdUsuario(data);   
              this.navCtrl.push(TabsPage);
              loading.dismiss();
          });
      }).catch(error=> {
        console.log("error: " + error);
      })
      ;

      this.push.rx.notification().subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });
    }
  }

  showToast(msg:string, duration:number= 3000,position: string= "bottom") {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position
    });

    toast.present(toast);
}
}
