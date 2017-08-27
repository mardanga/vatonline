import { DEPENDENCIAS } from './../data/dependencias';
import { IAlarma } from './../clases/alarma';
import { IUsuario } from './../clases/usuario';
import { Injectable } from '@angular/core';
import {Headers, RequestOptions,   Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


@Injectable()
export class VatsimService {
  
  constructor(private http:Http
  ) {
   }

  headers: Headers;
  options: RequestOptions;
  dominio = "http://vatsimws.somee.com/api/";//"http://localhost:61355/api/";//

  obtenerControladores(idUsuario){
    let url =this.dominio + "atc?idUsuario=" + idUsuario;

    return this.http.get(url).map(res => res.json());
  }

  registrar(newUsu:IUsuario) {
    let  urlRegistro = this.dominio + "user/";//this.dominio + "usuario/";
    let body = 'cid='+newUsu.cid+'&id='+newUsu.id+'&mail='+newUsu.mail+'&idDevice='+newUsu.idDevice;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //headers.append('Accept', 'application/json');
    //let options = new RequestOptions({ headers: headers });
    
    return this.http.post(urlRegistro, body, {headers}).map(res=> res.json());
  }

  agregarAlarma(alarma:IAlarma){
    let  urlAlarma = this.dominio +  "alarm/";//this.dominio + "usuario/";
    let body = 'id='+alarma.id+'&idUsuario='+alarma.idUsuario+'&callsign='+alarma.callsign+'&tipo='+alarma.tipo;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //headers.append('Accept', 'application/json');
    
     return this.http.post(urlAlarma, body, {headers}).map(res=> res.json());
  }

  quitarAlarma(alarma:IAlarma){
    let  urlAlarma =this.dominio +  "alarm/DeleteAlarm/";//this.dominio + "usuario/";
    let body = 'id=' + alarma.id + '&tipo=99';
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //let options = new RequestOptions({ headers: headers });
    return this.http.post(urlAlarma, body, {headers}).map(res=> res.json());
  }

  obtenerAlarmas(idUsuario:number){
    let  urlAlarma = this.dominio +  "alarm?id="+idUsuario;//this.dominio + "usuario/";
     return this.http.get(urlAlarma).map(res=> res.json());
  }

  obtenerDependencias(texto:string):Observable<any>{
     let data = DEPENDENCIAS.filter((item) => {
       return  item.icao.toLowerCase().indexOf(texto.toLowerCase()) > -1
      });
      //console.log(data);
     return Observable.of(data).map(o => data);
    
  }   
      
  getIdUsuario(){
      let id = localStorage.getItem("idUsuario");
      if(id != null)
        return parseInt(id);
      else
        return 0;
  }

  setIdUsuario(id:number){
      localStorage.setItem("idUsuario", id.toString());
  }

  getControladoresOffline(){
      let atcs = localStorage.getItem("atcs");
      
      if(atcs != null){
        atcs = JSON.parse(atcs);
      }
      return atcs;
  }

  setControladoresOffline(atcs){
      localStorage.setItem("atcs", JSON.stringify(atcs));
  }
  
  getAlarmasOffline(){
      let alarmas = localStorage.getItem("alarms");
      
      if(alarmas != null){
        alarmas = JSON.parse(alarmas);
      }
      return alarmas;
  }

  setAlarmasOffline(alarmas){
      localStorage.setItem("alarms", JSON.stringify(alarmas));
  }

  getOnlineInfo(){
      let estado = localStorage.getItem("online");
      
      if(estado != null){
        estado = JSON.parse(estado);
      }
      console.log(estado);
      return estado;
  }

  setOnlineInfo(estado){
      localStorage.setItem("online", JSON.stringify(estado));
  }

  cerrarSesion(){
     localStorage.setItem("idUsuario", "0");
     localStorage.setItem("atcs", null);
     localStorage.setItem("alarms", null);
  }
}
 