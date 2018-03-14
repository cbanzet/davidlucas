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

import { Product } from './product';
import { ProductsService } from './products.service';

import { ProductsListComponent } from './../products-list/products-list.component';
import { ProductFormComponent } from './../product-form/product-form.component';
import { ProductDetailComponent } from './../product-detail/product-detail.component';

import { FilterPipe } from './../products-list/filter';

@NgModule({
  declarations: [
    ProductsListComponent,
    ProductFormComponent,
    ProductDetailComponent,
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
    ProductsService,
    AuthService
  ]
})
export class ProductsModule { }
