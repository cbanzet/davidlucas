import { Forfait } from './forfait';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { FirebaseApp } from 'angularfire2';
import {   AngularFireDatabase, 
          AngularFireList, 
          AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ForfaitService {

  private forfaitPath = '/forfaits';
 
  forfaitsRef: AngularFireList<any>;
  prestationRef: AngularFireList<any>;
  forfait:  Observable<any>;
  forfaitTypeRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private router: Router) {
    this.forfaitsRef = db.list('/forfaits', ref => ref.orderByChild('title'));
    this.prestationRef = db.list('/prestations', ref => ref.orderByChild('title'));
    this.forfaitTypeRef = db.list('/forfaitTypes');
  }

////////////////////////////////////////////////////
  ///////////////////// GET /////////////////////////
////////////////////////////////////////////////////

  getPrestaTypeSnapshotList() {
    return this.prestationRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) );
    });
  }

  getForfaitsList() {
    return this.forfaitsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        { prestations: Object.values(snap.payload.val().prestations)},
        { title: snap.payload.val().title },
        { time: snap.payload.val().time },
        { priceDavid: snap.payload.val().priceDavid },
        { priceTeam: snap.payload.val().priceTeam },
        { type: snap.payload.val().type.title },
        { $key: snap.key }) );
    });
  }

  getPrestationWithKey(key: string): Observable<Forfait> {
    const forfaitPath = `forfaits/${key}`;
    this.forfait = this.db.object(forfaitPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { key : action.payload.key,  ...action.payload.val() };
        return data;
      });
    return this.forfait;
  }

  getPrestationsList() {
    return this.prestationRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  getForfaitTypeList() {
    return this.forfaitTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { 
          $key: snap.key, 
          title: snap.payload.val().title,
        }) 
      )
    })
  } 



////////////////////////////////////////////////////
  /////////////// C R E A T E ///////////////////////
////////////////////////////////////////////////////

 createForfait(newForfaitForm: NgForm, prestaData): void {
     console.log(prestaData);
  
    var newForfaitData = {};
    var times: number = 0;
   
    newForfaitData['title'] = newForfaitForm?newForfaitForm.value.newForfaitTitle:0;
    var newPrestation = [];
    var updatePrestationsData = {};
    var prestaDataLength = prestaData.length ;
    var newForfaitTypes = {
       key: newForfaitForm.value.selectedTypes.key,
       title: newForfaitForm.value.selectedTypes.title
    };
   newForfaitData['type'] = newForfaitTypes;

   if (prestaDataLength )
   {
      for( var i=0; i < prestaDataLength ; i++ ) {
          newPrestation[i+1] = {
          key:prestaData[i].key,
          title: prestaData[i].title,
          order:  i+1
        };
        times = times + +prestaData[i].time;
      }

      newForfaitData['prestations'] = newPrestation ;
      newForfaitData['time'] = times;

      //Insert in forfait
      var keyNewForfait = this.forfaitsRef.push(newForfaitData).key;
        // lookup
      for( var i=0; i <  prestaDataLength ; i++ ){
          // insert in Prestation
          updatePrestationsData['prestations/'+ prestaData[i].key +'/forfaits/'+keyNewForfait] = true;
          // Insert in LookUp
          // this.db.list('/lookUpPrestationForfait').update(forfaitTabData[i].key, {[keyNewForfait]:true});
          updatePrestationsData["lookUpForfaitPrestations/"+prestaData[i].key +"/"+keyNewForfait] = true;
      };
    }

    this.db.object("/").update(updatePrestationsData).then(_=>'Prestations Saved');
    this.router.navigate(['/forfaits']);

    console.log(newForfaitData, keyNewForfait);
  }

////////////////////////////////////////////////////
  /////////////// D E L E T E ///////////////////////
////////////////////////////////////////////////////


  deleteForfait(forfait): void {
   var keyForfait = forfait.$key;
   var keyPresta = forfait.prestations;
    const forfaitPath = `forfaits/${keyForfait}`;
    // const forfaitInPrestationPath = `prestations/${keyPresta}/forfaits/${keyForfait}`;
    const forfaitInLookUpPrestationPath = `lookUpPrestationForfait/${keyPresta}/${keyForfait}`;
     console.log(keyPresta[0].key);

    this.db.object(forfaitPath).remove().then(_ =>
      console.log(forfait.title + 'Deleted In Forfaits DB')
    );
    if (keyPresta.length) {
      for(var i= 0;i < keyPresta.length;i++) {
        this.db.object( `prestations/${keyPresta[i].key}/forfaits/${keyForfait}`).remove().then(_=>
         console.log(forfait.title + 'Deleted In Prestations DB')
          );

      }

    }

    if (keyPresta.length) {
      for(var i= 0;i < keyPresta.length;i++) {
        this.db.object( `lookUpPrestationForfait/${keyPresta[i].key}/${keyForfait}`).remove().then(_=>
         console.log(forfait.title + 'Deleted In LookUp')
          );

      }

    }

  }

////////////////////////////////////////////////////
  ///////////// U P D A T E ////////////////
////////////////////////////////////////////////////

  // Update Member's data
  updateForfait(forfait,field,value): void {

    var forfaitKey = forfait.$key;
   // var prestationKey = forfait.prestation.key;

    const forfaitPath = `forfaits/${forfaitKey}/${field}`;
   // const prestaInSalonPath = `${this.salonPath}/${salonKey}/prestations/${forfaitKey}/${field}`;

    var updateField = {};
    updateField[forfaitPath] = value;
   // updateField[prestaInSalonPath]= value;

    console.log(updateField);
    this.db.object("/").update(updateField).then(_=>
       console.log('Prestation MAJ dans ' + forfaitPath )
    );
  }

}
