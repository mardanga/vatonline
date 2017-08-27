import {RegistroPage} from '../../pages/registro/registro';

import { NavController } from 'ionic-angular';

import { VatsimService } from './../../services/vatsim.service';
import { Component } from '@angular/core';


@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  text: string;

  constructor(private vatsimSrv: VatsimService, private navCtrl: NavController) {
 
  }

  cerrarSesion(){
    this.vatsimSrv.cerrarSesion();
    this.navCtrl.setRoot(RegistroPage);
    this.navCtrl.goToRoot({});    
  }
}
