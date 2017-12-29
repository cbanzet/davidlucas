import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
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

import { ClientService } from './client.service';
import { Client } from './client';
import { ClientsListComponent } from './../clients-list/clients-list.component';
import { ClientFormComponent } from './../client-form/client-form.component';
import { ClientDetailComponent } from './../client-detail/client-detail.component';
import { ClientSearchComponent } from './../client-search/client-search.component';


@NgModule({
  declarations: [
    ClientsListComponent,
    ClientFormComponent,
    ClientSearchComponent,
    ClientDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,ReactiveFormsModule,
    AngularMaterialModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    AngularMaterialModule    
  ],
  providers: [
    ClientService,
    AuthService
  ]
})
export class ClientModule { }