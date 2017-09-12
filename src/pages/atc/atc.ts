import { Component } from '@angular/core';
import {NavController,  LoadingController,  ToastController,  PopoverController} from 'ionic-angular';
import {AtcDetallePage} from "../index.pages";
import { Network } from '@ionic-native/network';

//servicios
import { VatsimService} from '../../services/vatsim.service';
import { PopoverComponent } from "../../components/popover/popover";

@Component({
  selector: 'page-atc',
  templateUrl: 'atc.html',
})
export class AtcPage {
  
  atcs:any[]=[];
  atcsAux:any=[];
  buscar:boolean = false;
  idUsuario:number;


  constructor(
    private navCtrl: NavController,
    private vatsimSrv : VatsimService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private network: Network,
    private popoverCtrl: PopoverController    
  ) {

  }

  ionViewDidLoad() {
    this.idUsuario = this.vatsimSrv.getIdUsuario();
    this.getControladores(true);
  }

  ionViewDidEnter(){
    
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));
  
    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.vatsimSrv.setOnlineInfo(true);
    }, error => console.error(error));
  
    if(localStorage.getItem('controladores')=="1"){
      this.getControladores(true);
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

  doRefresh(refresher) {

    if(!this.vatsimSrv.getOnlineInfo())
    {
      this.showToast("No hay conexion a internet");
      refresher.complete();
      return
    }
    this.vatsimSrv.obtenerControladores(this.idUsuario).subscribe(
      data=> {
        this.atcs = data
        refresher.complete();
    });
    
  }

  irAtcDetalle(controlador:any){
    
    this.navCtrl.push(AtcDetallePage, {"controlador": controlador});
  }

  getControladores(conLoading:boolean = false){
    
    if(!this.vatsimSrv.getOnlineInfo())
    {
      this.showToast("No hay conexion a internet");
      return
    }

    localStorage.setItem('controladores',"0");
    if(conLoading)
    {
      let loader = this.loadingCtrl.create({
          content: "Cargando...",
        });
        loader.present().then(() => {
        this.vatsimSrv.obtenerControladores(this.idUsuario).subscribe(
          data=> {
            this.atcs = data;
            this.atcsAux = this.atcs;
            this.vatsimSrv.setControladoresOffline(this.atcs);
            if(conLoading)
            {
              loader.dismiss();
            }
          }
        );
      });
    }
    else{
      this.vatsimSrv.obtenerControladores(this.idUsuario).subscribe(
        data=> {
          this.atcs = data;
          this.atcsAux = this.atcs;
          this.vatsimSrv.setControladoresOffline(this.atcs);
        }
      );
    }
    //console.log(this.atcs);
    
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.inicializarLista();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.atcs = this.atcs.filter((item) => {
        //console.log(item.callsign.toLowerCase());
        return (item.callsign.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      
    //console.log(this.atcs);
    }
  }

  inicializarLista(){
    this.atcs = this.atcsAux;
  }

  toggleSearch() {
        this.buscar = this.buscar ? false : true;
        this.inicializarLista();
    }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: ev
    });
  }
}
