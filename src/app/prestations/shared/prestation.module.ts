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
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Prestation } from './prestation';
import { PrestationService } from './prestation.service';

import { PrestationListComponent } from './../prestation-list/prestation-list.component';
import { PrestationFormComponent } from './../prestation-form/prestation-form.component';
import { PrestationDetailComponent } from './../prestation-detail/prestation-detail.component';

import { FilterPipe } from './../prestation-list/filter';

@NgModule({
  declarations: [
    PrestationListComponent,
    PrestationFormComponent,
    PrestationDetailComponent,
    FilterPipe
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
    PrestationService,
    AuthService
  ]
})

export class PrestationModule { }
