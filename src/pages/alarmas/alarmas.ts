import { AgregarAlarmaPage } from '../index.pages';
import { IAlarma } from './../../clases/alarma';
import { VatsimService } from './../../services/vatsim.service';
import { Component } from '@angular/core';
import { LoadingController, ModalController, ToastController } from 'ionic-angular';
import { Network } from "@ionic-native/network";




@Component({
  selector: 'page-alarmas',
  templateUrl: 'alarmas.html',
})
export class AlarmasPage {

  idUsuario:number;
  alarmas=[];
  
  constructor(
    private vatsimSrv : VatsimService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private network: Network,
    private toastCtrl: ToastController
  ) {
  }

  ionViewDidEnter(){
    
      if(localStorage.getItem("alarmas")=="1"){
        this.getAlarmas(true);
      }
    this.network.onConnect().subscribe(data => {
   
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));
  }

  ionViewDidLoad() {
      this.idUsuario = parseInt(localStorage.getItem('idUsuario'));
      this.getAlarmas(true);
  }

doRefresh(refresher) {
    this.vatsimSrv.obtenerAlarmas(this.idUsuario).subscribe(
          data=> {
            this.alarmas = data;
            //this.atcsAux = this.atcs;
            this.actualizarAlarmas();
                    refresher.complete();

          }
        );
    
  }

  showToast(msg: string, duration: number = 3000, position: string = "bottom") {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }

  getAlarmas(conLoading:boolean = false){
     if (!this.vatsimSrv.getOnlineInfo()) {
      this.showToast("No hay conexion a internet");
      return
    }
    if(conLoading)
    {
      let loader = this.loadingCtrl.create({
          content: "Cargando...",
        });
        loader.present().then(() => {
        this.vatsimSrv.obtenerAlarmas(this.idUsuario).subscribe(
          data=> {
            this.alarmas = data;
            //this.atcsAux = this.atcs;
            this.actualizarAlarmas();
            if(conLoading)
            {
              loader.dismiss();
            }
          }
        );
      });
    }
    else{
      this.vatsimSrv.obtenerAlarmas(this.idUsuario).subscribe(
        data=> {
          this.alarmas = data;
          this.actualizarAlarmas();
          //this.atcsAux = this.atcs;
        }
      );
    }
    this.vatsimSrv.setAlarmasOffline(this.alarmas);
  }


  quitarAlarma(alarma:IAlarma){
     if (!this.vatsimSrv.getOnlineInfo()) {
      this.showToast("No hay conexion a internet");
      return
    }
    alarma.tipo=99;
    let loading = this.loadingCtrl.create({
      content: 'Quitando el seguimiento de ' + alarma.icao
    });
    loading.present().then(() => {
      this.vatsimSrv.quitarAlarma(alarma).subscribe(
            data=> { 
                this.alarmas = this.alarmas.filter((item) => {
                  //console.log(item.icao.toLowerCase());
                  return (item.icao.toLowerCase().indexOf(alarma.icao.toLowerCase()) ==-1);
                });
                localStorage.setItem('controladores',"1");
                loading.dismiss();
      }); 
    });
  }

  actualizarAlarmas(){
      localStorage.setItem('alarmas',"0");
  }

  irAgregarAlarma(){
    //this.navCtrl.push(AgregarAlarmaPage);
    let modal = this.modalCtrl.create(AgregarAlarmaPage);
    modal.present();
    modal.onDidDismiss( 
      p=> {
          if(localStorage.getItem("alarmas")=="1"){
            this.getAlarmas(true);
          }
      }
     );
  }
}

