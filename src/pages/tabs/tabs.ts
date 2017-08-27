import { Component } from '@angular/core';
import { AtcPage, AlarmasPage } from "../index.pages";


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1:any;
  tab2:any;

  constructor() {
    this.tab1 = AtcPage;
    this.tab2 = AlarmasPage;
  }

  ionViewDidLoad() {
    
  }

}
