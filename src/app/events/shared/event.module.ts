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
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Event } from './event';
import { EventService } from './event.service';

import { EventDetailComponent } from './../event-detail/event-detail.component';
import { EventFormComponent } from './../event-form/event-form.component';
import { EventListComponent } from './../event-list/event-list.component';


@NgModule({
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
  declarations: [
  	EventDetailComponent,
  	EventFormComponent,
  	EventListComponent
  ],
  providers: [
    EventService,
    AuthService
  ]  
})
export class EventModule { }
