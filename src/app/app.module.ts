import { CLOUDSETTINGS } from './../config/config';
import { CloudModule } from '@ionic/cloud-angular';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule,NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { MyApp } from './app.component';
import { AtcPage, AtcDetallePage, TabsPage, 
  AlarmasPage,
  RegistroPage,
  AgregarAlarmaPage 
} from '../pages/index.pages';

import { VatsimService} from '../services/vatsim.service';
import { SeguidoPipe } from '../pipes/seguido/seguido';
import { Network } from '@ionic-native/network';
import { PopoverComponent } from '../components/popover/popover';

@NgModule({
  declarations: [
    MyApp,
    AtcPage,
    AtcDetallePage,
    TabsPage,
    AlarmasPage,
    RegistroPage,
    AgregarAlarmaPage,
    SeguidoPipe,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    CloudModule.forRoot(CLOUDSETTINGS),
    FormsModule, 
    ReactiveFormsModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AtcPage,
    AtcDetallePage,
    TabsPage,
    AlarmasPage,
    RegistroPage,
    AgregarAlarmaPage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VatsimService,
    Network,
    
  ]
})
export class AppModule {}
