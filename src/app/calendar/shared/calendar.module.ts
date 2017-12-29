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

import { DayViewComponent, DialogNewEvent, DialogSeeEvent } from './../day-view/day-view.component';
import { CalendarService } from './calendar.service';

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
  	DayViewComponent,
  	DialogNewEvent,
    DialogSeeEvent
  ],
  entryComponents: [DialogNewEvent, DialogSeeEvent]    
})
export class CalendarModule { }
