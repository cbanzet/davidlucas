import { Forfait } from './forfait';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
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

  constructor(private db: AngularFireDatabase, private router: Router) {

    // this.prestationsRef = db.list('/prestations')
    this.forfaitsRef = db.list('/forfaits');
    this.prestationRef = db.list('/prestations');
    

  }


///////////////////////////////////////////////////////////////////////////
  ///////////////////// GET /////////////////////////
///////////////////////////////////////////////////////////////////////////



  getPrestaTypeSnapshotList() {
    return this.prestationRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) );
    });
  }

  getForfaitsList() {
    return this.forfaitsRef.snapshotChanges().map(arr => {
     // console.log(arr[1].payload.val().prestations);
      return arr.map(snap => Object.assign(
        { prestations: Object.values(snap.payload.val().prestations)},
        { title: snap.payload.val().title },
        { time: snap.payload.val().time },
        { price: snap.payload.val().price },
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



///////////////////////////////////////////////////////////////////////////
  /////////////// C R E A T E ///////////////////////
///////////////////////////////////////////////////////////////////////////



  createForfait(newForfaitForm: NgForm): void {
  	// console.log(newForfaitForm.value);
  
    var newForfaitData = {};
    var times: number = 0;
    var price: number = 0;
   
    newForfaitData['title'] = newForfaitForm?newForfaitForm.value.newForfaitTitle:0;
    var newPrestation = [];

    newPrestation[1] = {
      key: newForfaitForm.value.selectedPrestation1.key,
      title: newForfaitForm.value.selectedPrestation1.title,
      order:  1
    };
    newForfaitData['prestations'] = newPrestation;


    newPrestation[2] = {
      key: newForfaitForm.value.selectedPrestation2.key,
      title: newForfaitForm.value.selectedPrestation2.title,
      order:  2
    };
    newForfaitData['prestations'] = newPrestation;

    newPrestation[3] = {
      key: newForfaitForm.value.selectedPrestation3.key,
      title: newForfaitForm.value.selectedPrestation3.title,
      order:  3
    };
    newForfaitData['prestations'] = newPrestation;
    times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time + 
            +newForfaitForm.value.selectedPrestation3.time ;
    newForfaitData['time'] = times;

     price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
              +newForfaitForm.value.selectedPrestation1.priceTeam +
             // tslint:disable-next-line:max-line-length
              +newForfaitForm.value.selectedPrestation2.priceDavid +
              +newForfaitForm.value.selectedPrestation2.priceTeam +
             // tslint:disable-next-line:max-line-length
             +newForfaitForm.value.selectedPrestation3.priceDavid +
             +newForfaitForm.value.selectedPrestation3.priceTeam ;

    newForfaitData['price'] = price;

    // Insertion dans le noeud forfait
    var keyNewForfait = this.forfaitsRef.push(newForfaitData).key;

     // Insertion dans le noeud prestation (denormalisation)
    var updatePrestationsData = {};

    var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
    updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
    // Insert in LookUp
    this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});

    var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
    updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
    // Insert in LookUp
    this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});

    var prestationkey3 = newForfaitForm.value.selectedPrestation3.key;
    updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
    // Insert in LookUp
    this.db.list('/lookUpPrestationForfait').update(prestationkey3, {[keyNewForfait]:true});

    this.db.object("/").update(updatePrestationsData).then(_=>'Prestations Saved');

    // fin

     this.router.navigate(['/forfaits']);

    // console.log(keyNewPresta);  
    console.log(newForfaitData, keyNewForfait);
  }










// createForfait(newForfaitForm: NgForm): void {
//     // console.log(newForfaitForm.value);
  
//     var newForfaitData = {};
//     var times: number = 0;
//     var price: number = 0;
   
//     newForfaitData['title'] = newForfaitForm?newForfaitForm.value.newForfaitTitle:0;
//     var newPrestation = [];
//     var numberKey = newForfaitForm.value.pickedNumberPrestation.key;

//       // debut

//       if (numberKey === '2') {

//         newPrestation[1] = {
//           key: newForfaitForm.value.selectedPrestation1.key,
//           title: newForfaitForm.value.selectedPrestation1.title,
//           order:  1
//         };
//         newForfaitData['prestations'] = newPrestation;
    
    
//         newPrestation[2] = {
//           key: newForfaitForm.value.selectedPrestation2.key,
//           title: newForfaitForm.value.selectedPrestation2.title,
//           order:  2
//         };
//         newForfaitData['prestations'] = newPrestation;
    
//         newForfaitData['prestations'] = newPrestation;
//         times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time ;
//         newForfaitData['time'] = times;
    
//          price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
//                   +newForfaitForm.value.selectedPrestation1.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                   +newForfaitForm.value.selectedPrestation2.priceDavid +
//                   +newForfaitForm.value.selectedPrestation2.priceTeam ;
    
//         newForfaitData['price'] = price;

//       }

//       else if (numberKey === '3') {

//         newPrestation[1] = {
//           key: newForfaitForm.value.selectedPrestation1.key,
//           title: newForfaitForm.value.selectedPrestation1.title,
//           order:  1
//         };
//         newForfaitData['prestations'] = newPrestation;
    
    
//         newPrestation[2] = {
//           key: newForfaitForm.value.selectedPrestation2.key,
//           title: newForfaitForm.value.selectedPrestation2.title,
//           order:  2
//         };
//         newForfaitData['prestations'] = newPrestation;
    
//         newPrestation[3] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  3
//         };
//         newForfaitData['prestations'] = newPrestation;
//         times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time + 
//                 +newForfaitForm.value.selectedPrestation3.time ;
//         newForfaitData['time'] = times;
    
//          price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
//                   +newForfaitForm.value.selectedPrestation1.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                   +newForfaitForm.value.selectedPrestation2.priceDavid +
//                   +newForfaitForm.value.selectedPrestation2.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                  +newForfaitForm.value.selectedPrestation3.priceDavid +
//                  +newForfaitForm.value.selectedPrestation3.priceTeam ;
    
//         newForfaitData['price'] = price;

//       }
//       else if (numberKey === '4') {

//         newPrestation[1] = {
//           key: newForfaitForm.value.selectedPrestation1.key,
//           title: newForfaitForm.value.selectedPrestation1.title,
//           order:  1
//         };
//         newForfaitData['prestations'] = newPrestation;
    
    
//         newPrestation[2] = {
//           key: newForfaitForm.value.selectedPrestation2.key,
//           title: newForfaitForm.value.selectedPrestation2.title,
//           order:  2
//         };
//         newForfaitData['prestations'] = newPrestation;
    
//         newPrestation[3] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  3
//         };
//         newPrestation[4] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  4
//         };
//         newForfaitData['prestations'] = newPrestation;
//         times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time + 
//                 +newForfaitForm.value.selectedPrestation3.time + 
//                 +newForfaitForm.value.selectedPrestation4.time ;
//         newForfaitData['time'] = times;
    
//          price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
//                   +newForfaitForm.value.selectedPrestation1.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                   +newForfaitForm.value.selectedPrestation2.priceDavid +
//                   +newForfaitForm.value.selectedPrestation2.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                  +newForfaitForm.value.selectedPrestation3.priceDavid +
//                  +newForfaitForm.value.selectedPrestation3.priceTeam +

//                  +newForfaitForm.value.selectedPrestation4.priceDavid +
//                  +newForfaitForm.value.selectedPrestation4.priceTeam;
    
//         newForfaitData['price'] = price;


//       }

//       else if (numberKey === '5') {

//         newPrestation[1] = {
//           key: newForfaitForm.value.selectedPrestation1.key,
//           title: newForfaitForm.value.selectedPrestation1.title,
//           order:  1
//         };
//         newForfaitData['prestations'] = newPrestation;
    
    
//         newPrestation[2] = {
//           key: newForfaitForm.value.selectedPrestation2.key,
//           title: newForfaitForm.value.selectedPrestation2.title,
//           order:  2
//         };
//         newForfaitData['prestations'] = newPrestation;
    
//         newPrestation[3] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  3
//         };
//         newPrestation[4] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  4
//         };
//         newPrestation[5] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  5
//         };
//         newForfaitData['prestations'] = newPrestation;
//         times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time + 
//                 +newForfaitForm.value.selectedPrestation3.time + 
//                 +newForfaitForm.value.selectedPrestation4.time +
//                 +newForfaitForm.value.selectedPrestation5.time ;
//         newForfaitData['time'] = times;
    
//          price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
//                   +newForfaitForm.value.selectedPrestation1.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                   +newForfaitForm.value.selectedPrestation2.priceDavid +
//                   +newForfaitForm.value.selectedPrestation2.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                  +newForfaitForm.value.selectedPrestation3.priceDavid +
//                  +newForfaitForm.value.selectedPrestation3.priceTeam +

//                  +newForfaitForm.value.selectedPrestation4.priceDavid +
//                  +newForfaitForm.value.selectedPrestation4.priceTeam
                 
//                  +newForfaitForm.value.selectedPrestation5.priceDavid +
//                  +newForfaitForm.value.selectedPrestation5.priceTeam ;
    
//         newForfaitData['price'] = price;


//       }

//       else  {

//         newPrestation[1] = {
//           key: newForfaitForm.value.selectedPrestation1.key,
//           title: newForfaitForm.value.selectedPrestation1.title,
//           order:  1
//         };
//         newForfaitData['prestations'] = newPrestation;
    
    
//         newPrestation[2] = {
//           key: newForfaitForm.value.selectedPrestation2.key,
//           title: newForfaitForm.value.selectedPrestation2.title,
//           order:  2
//         };
//         newForfaitData['prestations'] = newPrestation;
    
//         newPrestation[3] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  3
//         };
//         newPrestation[4] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  4
//         };
//         newPrestation[5] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  5
//         };
//         newPrestation[6] = {
//           key: newForfaitForm.value.selectedPrestation3.key,
//           title: newForfaitForm.value.selectedPrestation3.title,
//           order:  6
//         };
//         newForfaitData['prestations'] = newPrestation;
//         times = times + +newForfaitForm.value.selectedPrestation1.time + +newForfaitForm.value.selectedPrestation2.time + 
//                 +newForfaitForm.value.selectedPrestation3.time + 
//                 +newForfaitForm.value.selectedPrestation4.time +
//                 +newForfaitForm.value.selectedPrestation5.time +
//                 +newForfaitForm.value.selectedPrestation6.time ;
//         newForfaitData['time'] = times;
    
//          price = price + +newForfaitForm.value.selectedPrestation1.priceDavid +
//                   +newForfaitForm.value.selectedPrestation1.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                   +newForfaitForm.value.selectedPrestation2.priceDavid +
//                   +newForfaitForm.value.selectedPrestation2.priceTeam +
//                  // tslint:disable-next-line:max-line-length
//                  +newForfaitForm.value.selectedPrestation3.priceDavid +
//                  +newForfaitForm.value.selectedPrestation3.priceTeam +

//                  +newForfaitForm.value.selectedPrestation4.priceDavid +
//                  +newForfaitForm.value.selectedPrestation4.priceTeam
                 
//                  +newForfaitForm.value.selectedPrestation5.priceDavid +
//                  +newForfaitForm.value.selectedPrestation5.priceTeam  +

//                  +newForfaitForm.value.selectedPrestation5.priceDavid +
//                  +newForfaitForm.value.selectedPrestation5.priceTeam ;
    
//         newForfaitData['price'] = price;


//       }
    
//     // fin

//     // Insertion dans le noeud forfait
//     var keyNewForfait = this.forfaitsRef.push(newForfaitData).key;

//      // Insertion dans le noeud prestation (denormalisation)
//     var updatePrestationsData = {};

//     if (numberKey === '2') {
//       var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
//       updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});
  
//       var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
//       updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});
//     }

//    else if (numberKey === '3') {
//       var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
//       updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});
  
//       var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
//       updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});
  
//       var prestationkey3 = newForfaitForm.value.selectedPrestation3.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey3, {[keyNewForfait]:true});
//     }
//     else if (numberKey === '4') {
//       var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
//       updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});
  
//       var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
//       updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});
  
//       var prestationkey3 = newForfaitForm.value.selectedPrestation3.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey3, {[keyNewForfait]:true});

//       var prestationkey4 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey4, {[keyNewForfait]:true});
//     }

//     else if (numberKey === '5') {
//       var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
//       updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});
  
//       var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
//       updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});
  
//       var prestationkey3 = newForfaitForm.value.selectedPrestation3.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey3, {[keyNewForfait]:true});

//       var prestationkey4 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey4, {[keyNewForfait]:true});

//       var prestationkey5 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey5, {[keyNewForfait]:true});
//     }

//     else {
//       var prestationkey1 = newForfaitForm.value.selectedPrestation1.key;
//       updatePrestationsData["prestations/"+ prestationkey1 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey1, {[keyNewForfait]:true});
  
//       var prestationkey2 = newForfaitForm.value.selectedPrestation2.key;
//       updatePrestationsData["prestations/"+ prestationkey2 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey2, {[keyNewForfait]:true});
  
//       var prestationkey3 = newForfaitForm.value.selectedPrestation3.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey3, {[keyNewForfait]:true});

//       var prestationkey4 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey4, {[keyNewForfait]:true});

//       var prestationkey5 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey5, {[keyNewForfait]:true});

//       var prestationkey6 = newForfaitForm.value.selectedPrestation4.key;
//       updatePrestationsData["prestations/"+ prestationkey3 +"/forfaits/"+keyNewForfait] = true;
//       // Insert in LookUp
//       this.db.list('/lookUpPrestationForfait').update(prestationkey6, {[keyNewForfait]:true});
//     }
   
//     this.db.object("/").update(updatePrestationsData).then(_=>'Prestations Saved');
//     this.router.navigate(['/forfaits']);
//     console.log(newForfaitData, keyNewForfait);
//   }


















///////////////////////////////////////////////////////////////////////////
  /////////////// D E L E T E ///////////////////////
///////////////////////////////////////////////////////////////////////////



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



///////////////////////////////////////////////////////////////////////////
  ///////////// U P D A T E ////////////////
///////////////////////////////////////////////////////////////////////////
 

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
