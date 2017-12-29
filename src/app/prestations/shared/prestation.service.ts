import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Prestation } from './prestation';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class PrestationService {

  private prestaPath = '/prestations';
  private prestaTypePath = '/prestationType';
  private salonPath = '/salons';

	prestationsRef: AngularFireList<any>;
  prestationRef:  AngularFireObject<any>;
  prestaTypeRef: AngularFireList<any>;
  prestations: Observable<any[]>;
  prestaType: Observable<any[]>;
  prestation:  Observable<any>;

  salonsRef: AngularFireList<any>;
  salon: Observable<any[]>;

  servicesRef : AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private router: Router) {

  	this.prestationsRef = db.list('/prestations')
    this.prestaTypeRef = db.list('/prestationType')
  	this.servicesRef = db.list('/services')
    this.salonsRef = db.list('/salons')

  }

  ///////////////// G E T ///////////////////////

  // Return Member with Key
  getPrestationWithKey(key: string): Observable<Prestation> {
    const prestaPath = `${this.prestaPath}/${key}`;
    this.prestation = this.db.object(prestaPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      });
    return this.prestation
  }

  getPrestationsList() {
    return this.prestationsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  getPrestaTypeList() {
    return this.prestaTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }  

  getPrestaTypeSnapshotList() {
    return this.prestaTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) )
    })
  }  

  getServicesList() {
    return this.servicesRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  getSalonsList() {
    return this.salonsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }  

  /////////////// C R E A T E ///////////////////////

  createPrestation(newPrestaForm: NgForm): void {
  	// console.log(newPrestaForm.value);
    var keysalon:string = newPrestaForm?newPrestaForm.value.selectedSalon.$key:0;
    var newPrestaData = {}
    newPrestaData['timestamp'] = Date.now();
    newPrestaData['salon'] = {
      key: keysalon,
      title: newPrestaForm?newPrestaForm.value.selectedSalon.title:0
    };
    newPrestaData['acronyme'] = newPrestaForm?newPrestaForm.value.newPrestaAcronyme:0;
    newPrestaData['title'] = newPrestaForm?newPrestaForm.value.newPrestaTitle:0;
    newPrestaData['details'] = newPrestaForm?newPrestaForm.value.newPrestaDetail:0;
    newPrestaData['time'] = newPrestaForm?newPrestaForm.value.selectedTime:0;
    newPrestaData['priceTeam'] = newPrestaForm?newPrestaForm.value.newPrestaPrix:0;
    newPrestaData['priceDavid'] = newPrestaForm?newPrestaForm.value.newPrestaPrixDavid:0;
    // Format Types
    var nbTypes = newPrestaForm.value.selectedTypes?newPrestaForm.value.selectedTypes.length:0;
    if (nbTypes) { 
      var newPrestaTypes = {};
      for(var i=0;i<nbTypes;i++) {
        console.log(newPrestaForm.value.selectedTypes[i]);
        console.log(newPrestaForm.value.selectedTypes[i].key);
        // newPrestaTypes[newPrestaForm.value.selectedTypes[i].key] = true;
        newPrestaTypes[newPrestaForm.value.selectedTypes[i].key] = newPrestaForm.value.selectedTypes[i].title;
      }
      newPrestaData['types'] = newPrestaTypes;
    }
    // Insert in Prestations Node and Get New Key
    var keyNewPresta = this.prestationsRef.push(newPrestaData).key;
    // Insert in Salon Node
    const prestaInSalonPath = `salons/${keysalon}/prestations`;
    this.db.list(prestaInSalonPath).update(keyNewPresta, newPrestaData).then(_=>
      console.log(newPrestaData + 'Imported In Salon Node')
    );
    if (nbTypes) {
      // Insert In Types Node
      var updateTypesData = {};
      for(var i=0;i<nbTypes;i++) {
        var typekey = newPrestaForm.value.selectedTypes[i].key;
        updateTypesData["prestationType/"+ typekey +"/prestations/"+keyNewPresta] = true;
        // Insert in LookUp
        this.db.list('/lookUpTypesPrestation').update(typekey, {[keyNewPresta]:true});
      }
      this.db.object("/").update(updateTypesData).then(_=>'Types Saved');
    }

    // Insert in LookUp
    this.db.list('/lookUpSalonPrestation').update(keysalon, {[keyNewPresta]:true});
    this.router.navigate(['/prestations']);  	

    // console.log(keyNewPresta);  
    console.log(newPrestaData,keyNewPresta);   
  }




  // importPrestations(prestations):void {
  // 	console.log(prestations.value);
  // 	var prestationsValue = prestations.value;
		// var nbOfLine = (prestationsValue.match(/\n/g)||[]).length;

		// for(var i=0;i<=nbOfLine;i++)
		// {
	 //  	var line = prestationsValue.split('\n')[i];
	 //  	console.log(i,line);
	 //  	var tabs = line.split('\t');	
	 //  	var firstname = tabs[0];
	 //  	var lastname = tabs[1];
	 //  	var newPrestaData = {}
	 //    newPrestaData['timestamp'] = Date.now();
  // 	  newPrestaData['firstname'] = firstname;
  //   	newPrestaData['lastname'] = lastname;

	 //  	if(lastname) {
	 //  		console.log(line + " imported to DB!");
	 //  		// this.prestationsRef.push(newPrestaData);
	 //  	}
	 //  	else console.log(line + " not imported to DB");
		// }
  // }





  ///////////// U P D A T E ////////////////

 

  // Update Member's data
  updatePrestation(prestation,field,value): void {

    var prestaKey = prestation.$key;
    var salonKey = prestation.salon.key;

    const prestaPath = `${this.prestaPath}/${prestaKey}/${field}`;
    const prestaInSalonPath = `${this.salonPath}/${salonKey}/prestations/${prestaKey}/${field}`;

    var updateField = {};
    updateField[prestaPath]= value;
    updateField[prestaInSalonPath]= value;

    console.log(updateField);
    this.db.object("/").update(updateField).then(_=>
       console.log('Prestation MAJ dans ' + prestaPath + prestaInSalonPath)
    );
  }




  /////////////// D E L E T E ///////////////////////


  deletePrestation(prestation): void {
  	var keyPresta = prestation.$key;
    const prestaPath = `prestations/${keyPresta}`;
    const prestaInSalonPath = `salons/1/prestations/${keyPresta}`;    
    const prestaInLookUpSalonPath = `lookUpSalonPrestation/1/${keyPresta}`;    

    this.db.object(prestaPath).remove().then(_=>
      console.log(prestation + 'Deleted In Prestations DB')
    );
    this.db.object(prestaInSalonPath).remove().then(_=>
      console.log(prestation + 'Deleted In Salons DB')
    );
    this.db.object(prestaInLookUpSalonPath).remove().then(_=>
      console.log(prestation + 'Deleted In LookUp')
    );    
  }

  
  /////////////// M I G R A T E ///////////////////////

  migratePresta(prestas): void {
    var salonkey = "1";
    for(var i=0;i<=14;i++) {
      var newPrestaData = {}
      newPrestaData['timestamp'] = Date.now();
      newPrestaData['title'] = prestas[i].title;
      newPrestaData['details'] = prestas[i].details;
      newPrestaData['time'] = prestas[i].time;
      newPrestaData['priceDavid'] = prestas[i].priceDavid;
      newPrestaData['priceTeam'] = prestas[i].priceTeam;
      newPrestaData['salon'] = {
        key: salonkey,
        title: "David Lucas Paris"
      }

      // console.log(newPrestaData);
      // Insert in Prestations Table
      var key = this.prestationsRef.push(newPrestaData).key;
      // Insert in Salon Table      
      this.db.list('/salons/1/prestations/').update(key, newPrestaData).then(_=>
        console.log(newPrestaData + 'Imported In Salon Table')
      );
      // Insert in LookUp
      this.db.list('/lookUpSalonPrestation').update(salonkey, {[key]:true});
    }
  }

  // Dumb Functions
  emptyField(n: string) {
    if(!n || n=='') return '';
    else return n;
  }


}
