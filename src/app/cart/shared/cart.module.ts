import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Cart } from './cart';
import { CartService } from './cart.service';

import { CartFormComponent } from './../cart-form/cart-form.component';
import { CartListComponent } from './../cart-list/cart-list.component';
import { CartDetailComponent } from './../cart-detail/cart-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,ReactiveFormsModule,
    AngularMaterialModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  declarations: [
  	CartFormComponent,
  	CartListComponent,
  	CartDetailComponent
  ],
  providers: [
    CartService,
    AuthService
  ]    
})
export class CartModule { }
