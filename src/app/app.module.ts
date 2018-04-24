import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './ui/angularmaterial.module';
import { FlexLayoutModule } from '@angular/flex-layout';
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

///// Special Modules
import { ClientModule } from './clients/shared/client.module';
import { MemberModule } from './members/shared/member.module';
import { PrestationModule } from './prestations/shared/prestation.module';
import { ProductsModule } from './products/shared/products.module';
import { ForfaitModule } from './forfaits/shared/forfait.module';
import { EventModule } from './events/shared/event.module';
import { CartModule } from './cart/shared/cart.module';
import { FacturationModule } from './facturation/shared/facturation.module';

///// Environment
// import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AdminModule,
    UiModule,
    ClientModule,
    MemberModule,
    PrestationModule,
    ProductsModule,
    ForfaitModule,
    EventModule,
    CartModule,
    FacturationModule,
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
