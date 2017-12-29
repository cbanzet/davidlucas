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

import { ForfaitService } from './forfait.service';

import { ForfaitListComponent } from './../forfait-list/forfait-list.component';
import { ForfaitFormComponent } from './../forfait-form/forfait-form.component';
import { ForfaitDetailComponent } from './../forfait-detail/forfait-detail.component';


@NgModule({
  declarations: [
    ForfaitListComponent,
    ForfaitFormComponent,
    ForfaitDetailComponent,
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
    ForfaitService,
    AuthService
  ]
})

export class ForfaitModule { }
