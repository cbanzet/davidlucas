import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { FacturationService } from './facturation.service';

import { FacturationListComponent } from './../facturation-list/facturation-list.component';
import { FacturationDetailComponent } from './../facturation-detail/facturation-detail.component';
import { FacturationFormComponent } from './../facturation-form/facturation-form.component';
import { FacturationEventComponent } from './../facturation-event/facturation-event.component';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    CommonModule,
    FormsModule,ReactiveFormsModule,
    AngularMaterialModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    AngularMaterialModule  
  ],
  declarations: [
  	FacturationListComponent,
  	FacturationDetailComponent,
  	FacturationFormComponent,
    FacturationEventComponent
  ],
  providers: [
  	FacturationService
  ]
})
export class FacturationModule { }