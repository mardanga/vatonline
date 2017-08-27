import { IAlarma } from './../../clases/alarma';
import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { VatsimService } from "../../services/vatsim.service";
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-agregar-alarma',
  templateUrl: 'agregar-alarma.html',
})
export class AgregarAlarmaPage {

  dependencias: any = [];
  idx: number = 0;
  cantScroll: number = 20;
  searchQuery: string = '';
  items: string[];
  idUsuario: number;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private vatsimSrv: VatsimService,
    private toastCtrl: ToastController,
    private network: Network
  ) {
  }

  ionViewDidLoad() {
    this.idUsuario = this.vatsimSrv.getIdUsuario();
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



  dismiss() {
    this.viewCtrl.dismiss();
  }

  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '' && val.trim().length > 1) {
      this.vatsimSrv.obtenerDependencias(val).subscribe(
        data => {
          //this.dependenci.as= data;
          this.dependencias = data;
        }
      );
    };

  }

  showToast(msg: string, duration: number = 3000, position: string = "bottom") {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }

  agregarAlarma(alarma) {
    if (!this.vatsimSrv.getOnlineInfo()) {
      this.showToast("No hay conexion a internet");
      return
    }
    // console.log(alarma);
    let alert = this.alertCtrl.create({
      title: 'Agregar',
      subTitle: 'Agregar el seguimiento a ' + alarma.icao,
      buttons: [

        {
          text: 'No'

        }, {
          text: 'Si',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Registrando el seguimiento de ' + alarma.icao
            });
            loading.present();
            console.log(alarma);
            let alm: IAlarma = {
              callsign: alarma.icao,
              tipo: 1,
              idUsuario: this.idUsuario,
              id: 0,
              fir: "",
              icao: "",
              pais: ""
            }
            this.vatsimSrv.agregarAlarma(alm).subscribe(
              data => {
                loading.dismiss();
                if (data.id > 0) {
                  this.actualizarAlarmas();
                }
              });

          }
        }
      ]
    });
    alert.present();
  }

  actualizarAlarmas() {
    localStorage.setItem('alarmas', "1");
  }

}
