import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';
import { Client } from './client';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ClientService {

  private basePath = '/clientes';

  clientsRef: AngularFireList<any>;
  clientRef:  AngularFireObject<any>;

  clients: Observable<any[]>;
  client:  Observable<any>;

  lastClientRef: AngularFireList<any>;
  lastClient: Observable<any[]>;

  constructor(private db: AngularFireDatabase, private router: Router) { 
    this.clientsRef = db.list('/clientes');
  }



  //////// G E T

  getValuesClientsList() {
    return this.clientsRef.valueChanges();
  }

  getSnapshotClientsList() {
    return this.lastClientRef.snapshotChanges();    
  }

  getClientsList() {
    return this.clientsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  get20LastClients() {
    this.clientsRef = this.db.list('clientes', ref => ref.limitToLast(20));
    return this.clientsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })    
  }

  getClient(key: string) {
    const clientPath = `clientes/${key}`;
    this.client = this.db.object(clientPath).valueChanges();
    return this.client
  }

  getClientWithKey(key: string) {
    const clientPath = `clientes/${key}`;
    this.client = this.db.object(clientPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const arrbills = action.payload.val().billhistory ? Object.values(action.payload.val().billhistory) : null; 
        const data = { $key,arrbills, ...action.payload.val() };
        return data;
      });
    return this.client
  }  

  getClientWithKeyOnce(key: string) {
    const clientPath = `clientes/${key}`;
    this.client = this.db.object(clientPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      });
    return this.client
  }    


  ////// C R E A T E


  createClientFromNewEventModal(newClientForm: NgForm) {

    var newClientData            = {}
    newClientData['timestamp']   = Date.now();    
    newClientData['firstname']   = newClientForm?newClientForm.value.newClientfirstname:0;
    newClientData['lastname']    = newClientForm?newClientForm.value.newClientlastname:0;
    newClientData['email']       = newClientForm?newClientForm.value.newClientemail:0;
    newClientData['phone']       = newClientForm?newClientForm.value.newClientphone:0;

    const clientkey              = this.clientsRef.push(newClientData).key;
    return clientkey;
  }







  ////// D E L E T E

  deleteClient(client): void {
    console.log(client);
    var clientKey = client.$key;
    const composerPath = `clientes/${clientKey}`;
    this.db.object(composerPath).remove();
    this.router.navigate(['/calendar']);      
  }  









 updateClient(key: string,field: any,value: any): void {
   console.log(field);
   const clientPath = `${this.basePath}/${key}`;   
   this.clientRef = this.db.object(clientPath);
   if(field=='firstname'){this.clientRef.update({ firstname: value})};
   if(field=='lastname'){this.clientRef.update({ lastname: value})};
   if(field=='email'){this.clientRef.update({ email: value})};
   if(field=='phone'){this.clientRef.update({ email: value})};
   if(field=='street'){this.clientRef.update({ street: value})};
   if(field=='zip'){this.clientRef.update({ zip: value})};
   if(field=='city'){this.clientRef.update({ city: value})};
   if(field=='birthdate'){this.clientRef.update({ birthdate: value})};
   if(field=='fichetechnique'){this.clientRef.update({ fichetechnique: value})};
 }





  // Default error handling for all actions
  private handleError(error) {
    console.log(error)
  }


}