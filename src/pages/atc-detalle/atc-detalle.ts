import { IAlarma } from './../../clases/alarma';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { IControlador } from '../../clases/controlador';
import { Network } from '@ionic-native/network';

//servicios
import { VatsimService } from '../../services/vatsim.service';

@Component({
  selector: 'page-atc-detalle',
  templateUrl: 'atc-detalle.html',
})
export class AtcDetallePage {

  controlador: IControlador;
  alarm: IAlarma = {
    id: 0,
    tipo: 1,
    idUsuario: 0,
    callsign: "",
    fir: "",
    icao: "",
    pais: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private vatsimSrv: VatsimService,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private network: Network

  ) {
    this.controlador = this.navParams.get("controlador");
    this.alarm.idUsuario = this.vatsimSrv.getIdUsuario();
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

  showToast(msg: string, duration: number = 3000, position: string = "bottom") {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }


  agregarAlarma() {
    if (!this.vatsimSrv.getOnlineInfo()) {
      this.showToast("No hay conexion a internet");
      return
    }

    let control = this.controlador.callsign;
    this.alarm.callsign = this.controlador.callsign.substring(0, this.controlador.callsign.indexOf('_'));
    if (this.controlador.positionCode != "CTR") {

      control = 'todas las dependencias de ' + this.controlador.callsign.substring(0, this.controlador.callsign.indexOf('_'));
    }



    let loading = this.loadingCtrl.create({
      content: 'Registrando el seguimiento de ' + control
    });
    loading.present();

    this.vatsimSrv.agregarAlarma(this.alarm).subscribe(
      data => {
        loading.dismiss();
        if (data.id > 0) {
          this.controlador.notificar = 1;
          this.actualizarAlarmas();
        }
      });

  }

  quitarAlarma() {

    if (!this.vatsimSrv.getOnlineInfo()) {
      this.showToast("No hay conexion a internet");
      return
    }


    let control = this.controlador.callsign;
    this.alarm.callsign = this.controlador.callsign.substring(0, this.controlador.callsign.indexOf('_'));
    if (this.controlador.positionCode != "CTR") {
      control = 'todas las dependencias de ' + this.controlador.callsign.substring(0, this.controlador.callsign.indexOf('_'));
    }

    let loading = this.loadingCtrl.create({
      content: 'Quitando el seguimiento de ' + control
    });
    loading.present();

    this.vatsimSrv.quitarAlarma(this.alarm).subscribe(
      data => {
        loading.dismiss();
        if (data.id > 0) {
          this.controlador.notificar = 0;
          this.actualizarAlarmas();
        }
      });

  }

  actualizarAlarmas() {
    localStorage.setItem('alarmas', "1");
    localStorage.setItem('controladores', "1");

  }
}
