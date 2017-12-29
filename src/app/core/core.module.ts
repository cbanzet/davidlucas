import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  providers: [AuthService],
  imports: [AngularFireAuthModule,AngularFireDatabaseModule]
})
export class CoreModule { }
