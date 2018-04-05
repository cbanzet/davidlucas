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
import 'rxjs/add/operator/take';

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

  	this.prestationsRef = db.list('/prestations', ref => ref.orderByChild('title'))
    this.prestaTypeRef = db.list('/prestationType')
  	this.servicesRef = db.list('/services')
    this.salonsRef = db.list('/salons')


    // this.coiffeursRef = db.list('/role/1/members', ref => ref.orderByChild('firstname'));    


  }

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  ///////////////// G E T ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////  

  // Return Member with Key
  getPrestationWithKey(key: string): Observable<Prestation> {
    const prestaPath = `${this.prestaPath}/${key}`;
    this.prestation = this.db.object(prestaPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const arrtypes = action.payload.val().types?Object.entries(action.payload.val().types):null;        
        const data = { 
          $key, 
          arrtypes,
          ...action.payload.val() 
        };
        return data;
      });
    return this.prestation
  }


  getPrestaTime(key:string) {
    // const prestaPath = `${this.prestaPath}/${key}/time`;
    // var time = this.db.object(prestaPath).query();
    return true;
  }


  // getPriceWithKey(key:string,firstname:string) {
  //   const prestaPath = `${this.prestaPath}/${key}/priceTeam`;
  //   var prestation = this.db.object(prestaPath).valueChanges().subscribe(data=> {
  //     //do something with your data;
  //     // console.log(data)
  //     return data;
  //   });

  //   // console.log(prestation);
  //   return prestation;
  // }

// constructor(afDb: AngularFireDatabase) {
//   afDb.list('items').snapshotChanges().map(actions => {
//     return actions.map(action => ({ key: action.key, ...action.payload.val() }));
//   }).subscribe(items => {
//     return items.map(item => item.key);
//   });
// }



  // getPrestationsList() {
  //   return this.prestationsRef.snapshotChanges().map(arr => {
  //     return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  //   })
  // }
  getPrestationsList() {
    return this.prestationsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { types: snap.payload.val().types?Object.entries(snap.payload.val().types):null},
        { $key: snap.key }) )
    })
  }

  getPrestaTypeList() {
    return this.prestaTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { 
          $key: snap.key, 
          title: snap.payload.val().title,
        }) 
      )
    })
  }

  getPrestaTypeNameList() {
    return this.prestaTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        // snap.payload.val(), 
        { 
          $key: snap.key, 
          title: snap.payload.val().title,
        }) 
      )
    })
  }    

  getSalonsList() {
    return this.salonsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }  


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  /////////////// C R E A T E ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////



  createPrestation(newPrestaForm: NgForm): void {
    // var keysalon:string = newPrestaForm?newPrestaForm.value.selectedSalon.$key:0;

    var newPrestaData = {}
    newPrestaData['timestamp'] = Date.now();
    // newPrestaData['salon'] = {
      // key: keysalon,
      // title: newPrestaForm?newPrestaForm.value.selectedSalon.title:0
    // };
    newPrestaData['acronyme'] = newPrestaForm.value.newPrestaAcronyme?newPrestaForm.value.newPrestaAcronyme:null;
    newPrestaData['title'] = newPrestaForm?newPrestaForm.value.newPrestaTitle:0;
    newPrestaData['details'] = newPrestaForm.value.newPrestaDetail?newPrestaForm.value.newPrestaDetail:null;
    newPrestaData['time'] = newPrestaForm?newPrestaForm.value.selectedTime:0;
    newPrestaData['priceTeam'] = newPrestaForm?newPrestaForm.value.newPrestaPrix:0;
    newPrestaData['priceDavid'] = newPrestaForm?newPrestaForm.value.newPrestaPrixDavid:0;
    // Format Types
    var nbTypes = newPrestaForm.value.selectedTypes?newPrestaForm.value.selectedTypes.length:0;
    if (nbTypes) { 
      var newPrestaTypes = {};
      for(var i=0;i<nbTypes;i++) {
        console.log(newPrestaForm.value.selectedTypes[i].$key);
        newPrestaTypes[newPrestaForm.value.selectedTypes[i].$key] = newPrestaForm.value.selectedTypes[i].title;
      }
      newPrestaData['types'] = newPrestaTypes;
    }
    // Insert in Prestations Node and Get New Key
    var keyNewPresta = this.prestationsRef.push(newPrestaData).key;


    // Insert in Salon Node
    // const prestaInSalonPath = `salons/${keysalon}/prestations`;
    // this.db.list(prestaInSalonPath).update(keyNewPresta, newPrestaData).then(_=>
      // console.log(newPrestaData + 'Imported In Salon Node')
    // );



    if (nbTypes) {
      // Insert In Types Node
      var updateTypesData = {};
      for(var i=0;i<nbTypes;i++) {
        var typekey = newPrestaForm.value.selectedTypes[i].$key;
        updateTypesData["prestationType/"+ typekey +"/prestations/"+keyNewPresta] = true;
        updateTypesData["lookUpTypePrestations/"+ typekey +"/"+keyNewPresta] = true;
      }
      this.db.object("/").update(updateTypesData).then(_=>'Types Saved');
    }
    this.router.navigate(['/prestations']);  	
  }



  addTypeToPrestation(prestation,type) {
    console.log(prestation); console.log(type);

    var prestakey = prestation.$key;
    var typekey = type.$key;
    var salonkey = prestation.salon?prestation.salon.key:null;
    var typetitle = `${type.title}`;

    var newTypePresta = {
      key: typekey,
      title: typetitle
    }    
    const typePath = `prestationType/${typekey}/prestations/${prestakey}`;    
    const typeInPrestaPath = `prestations/${prestakey}/types/${typekey}`;
    const typeInPrestaInSalonPath = `salons/${salonkey}/prestations/${prestakey}/types/${typekey}`;
    const typePrestaLookUpath = `lookUpTypePrestations/${typekey}/${prestakey}`;

    var updateData = {};
    updateData[typePath] = newTypePresta;
    updateData[typeInPrestaPath] = typetitle;
    if(salonkey) { updateData[typeInPrestaInSalonPath] = typetitle; }
    updateData[typePrestaLookUpath] = true;  

    // console.log(updateData);
    this.db.object("/").update(updateData).then(_=>
       console.log(updateData)
    );

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




////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  ///////////// U P D A T E ////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
 

  // Update Member's data
  updatePrestation(prestation,field,value): void {

    if(value) 
    {
      var prestaKey = prestation.$key;
      // var salonKey = prestation.salon.key;

      const prestaPath = `${this.prestaPath}/${prestaKey}/${field}`;
      // const prestaInSalonPath = `${this.salonPath}/${salonKey}/prestations/${prestaKey}/${field}`;

      var updateField = {};
      updateField[prestaPath]= value;
      // updateField[prestaInSalonPath]= value;

      console.log(updateField);
      this.db.object("/").update(updateField).then(_=>
         console.log(updateField)
      );
     }
     else { console.log("Delete Impossible Value Empty") }
  }



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  /////////////// D E L E T E ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  deletePrestation(prestation): void {
  	var prestakey = prestation.$key;
    // var salonkey = prestation.salon.key;
    var types = prestation.types?prestation.types:null;

    const prestaPath = `prestations/${prestakey}`;
    // const prestaInSalonPath = `salons/${salonkey}/prestations/${prestakey}`;    
    // const prestaInSalonLookUpPath = `lookUpSalonPrestations/${salonkey}/${prestakey}`; 

    var deleteData = {};
    deleteData[prestaPath] = null;
    // deleteData[prestaInSalonPath] = null;
    // deleteData[prestaInSalonLookUpPath] = null;

    if(types) {
      var arrayLength = types.length;
      for (var i = 0; i < arrayLength; i++) {
        var typekey = types[i][0];
        var prestaInTypePath = `prestationType/${typekey}/prestations/${prestakey}`;
        var prestaInTypeLookUpPath = `lookUpTypePrestations/${typekey}/${prestakey}`;
        deleteData[prestaInTypePath] = null;
        deleteData[prestaInTypeLookUpPath] = null;
      }
    }
    // console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );
  }

  removeTypeFromPresta(prestation,typekey) {

    console.log(prestation);
    console.log(typekey);

    var prestakey = prestation.$key;
    var typekey = typekey;
    var salonkey = prestation.salon?prestation.salon.key:null;

    const prestaPath = `prestations/${prestakey}/types/${typekey}`;
    const typePath = `prestationType/${typekey}/prestations/${prestakey}`;
    const salonPath = `salons/${salonkey}/prestations/${prestakey}/types/${typekey}`;
    const typePrestaLookUpath = `lookUpTypePrestations/${typekey}/${prestakey}`;

    var deleteData = {};
    deleteData[prestaPath] = null;
    deleteData[typePath] = null;
    deleteData[salonPath] = null;
    deleteData[typePrestaLookUpath] = null;

    // console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );

  }

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////  
  /////////////// M I G R A T E ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


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
