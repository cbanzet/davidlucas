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

import { Member } from './member';
import { MemberService } from './member.service';
import { MembersListComponent } from './../members-list/members-list.component';
import { MemberFormComponent } from './../member-form/member-form.component';
import { MemberDetailComponent } from './../member-detail/member-detail.component';
// import { MemberSearchComponent } from './../member-search/member-search.component';

import { SalonComponent } from './../salon/salon.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MemberFormComponent,
    MemberDetailComponent,
    // MemberSearchComponent,
    SalonComponent
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
    MemberService,
    AuthService
  ]
})
export class MemberModule { }