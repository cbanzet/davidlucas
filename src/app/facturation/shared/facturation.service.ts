import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Facture } from './facture';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class FacturationService {

	facturesRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private router: Router) 
  {
  	this.facturesRef= db.list('/factures');
  }




/////////////////////////////////////////////////
  ////////// G E T
/////////////////////////////////////////////////

  getFacturesList() {
    return this.facturesRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        // { musicians: snap.payload.val().artists?Object.values(snap.payload.val().artists):0},
        { $key: snap.key }) )
    })
  }

/////////////////////////////////////////////////
  ////////// C R E A T E
/////////////////////////////////////////////////


  createFacture(newFactureForm: NgForm): void {
    // console.log(newFactureForm.value);
    var newFactureData = {}
    newFactureData['timestamp'] = Date.now();    
    newFactureData['prestationTitle'] = newFactureForm.value.newFactureTitle?newFactureForm.value.newFactureTitle:"";
    newFactureData['prestationKey'] = newFactureForm.value.newFactureTitle?newFactureForm.value.newFactureTitle:"";
    newFactureData['length'] =    
    newFactureData['priceHT'] =
    newFactureData['priceTTC'] =
    newFactureData['clientFullName'] =
    newFactureData['clientKey'] =
    newFactureData['memberFullName'] =
    newFactureData['memberKey'] =

    newFactureData['startdate'] = newFactureForm.value.newFactureStarDate?newFactureForm.value.newFactureStarDate.toLocaleDateString():"";
    newFactureData['enddate'] = newFactureForm.value.newFactureEndDate?newFactureForm.value.newFactureEndDate.toLocaleDateString():"";
    console.log(newFactureData);
    // this.facturesRef.push(newFactureData).then(_=>'Facture Added');
  }

/////////////////////////////////////////////////
  ////////// U P D A T E
/////////////////////////////////////////////////



/////////////////////////////////////////////////
  ////////// D E L E T E
/////////////////////////////////////////////////





}
