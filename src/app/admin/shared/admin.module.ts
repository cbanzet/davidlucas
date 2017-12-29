import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';

import { AdminService } from './admin.service';
import { TodoComponent } from '../todo/todo.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    AngularMaterialModule    
  ],
  declarations: [
  	TodoComponent
  ],
  exports: [
    TodoComponent
  ],
  providers: [
  	AdminService
  ]
})
export class AdminModule { }
