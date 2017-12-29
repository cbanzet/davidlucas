import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './ui/angularmaterial.module';

import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './ui/not-found.component';
import { AppComponent } from './app.component';

///// Start FireStarter
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module'
import { UiModule } from './ui/shared/ui.module';
import { AdminModule } from './admin/shared/admin.module';

///// Start Firebase
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment.prod';
// export const firebaseConfig = environment.firebaseConfig;

///// Special Modules
import { ClientModule } from './clients/shared/client.module';
import { MemberModule } from './members/shared/member.module';
import { PrestationModule } from './prestations/shared/prestation.module';
import { ForfaitModule } from './forfaits/shared/forfait.module';
import { CalendarModule } from './calendar/shared/calendar.module'
import { EventModule } from './events/shared/event.module';
import { FacturationModule } from './facturation/shared/facturation.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AdminModule,
    UiModule,
    ClientModule,
    FacturationModule,
    MemberModule,
    PrestationModule,
    ForfaitModule,
    CalendarModule,
    EventModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)    
  ],
  declarations: [
    PageNotFoundComponent,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],  
})
export class AppModule { }
