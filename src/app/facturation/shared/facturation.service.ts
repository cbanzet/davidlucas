import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Facture } from './facture';
import { CartService } from './../../cart/shared/cart.service';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class FacturationService {

	facturesRef: AngularFireList<any>;
  dataFromEventKey: Observable<any>;
  eventPrice: Observable<any>;

  constructor(
    private cartService: CartService,
    private db: AngularFireDatabase, 
    private router: Router) 
  {
  	this.facturesRef= db.list('/factures', ref => ref.orderByChild('timestamp').limitToLast(50));
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

  // Return Member with Key
  getDataWithEventKey(key: string) {
    this.dataFromEventKey = this.db.object('events/'+ key)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { 
          $key, 
          // date: action.payload.val().date 
          ...action.payload.val()
        };
        return action;
      });
    return this.dataFromEventKey
  }

  getEventPrice(key:string) {
    this.eventPrice = this.db.object('events/'+ key)
      .snapshotChanges().map(action => {
        const data = { 
          priceDavid: action.payload.val().prestationPriceDavid,
          priceTeam: action.payload.val().prestationPriceTeam,
          coiffeur:action.payload.val().memberFirstname,
        };
        if(data.coiffeur=='David') return data.priceDavid;
        else return data.priceTeam;
      });
    return this.eventPrice    
  }






/////////////////////////////////////////////////
  ////////// C R E A T E
/////////////////////////////////////////////////


  // createFacture(newFactureForm: NgForm): void {
  // createFacture(date,coiffeur,client,prestation,pxHT,pxTAX,pxTTC): void {
  createNewFacture(date,client,coiffeur,prestation,moyenDePaiement,pxHT,pxTAX,pxTTC): void {
    // console.log(newFactureForm.value);
    console.log(date);
    console.log(client,coiffeur,prestation,pxHT,pxTAX,pxTTC);
    var newFactureData = {}
    newFactureData['timestamp'] = Date.now();    
    newFactureData['ref'] = "001";    

    // newFactureData['date'] = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    newFactureData['date'] = date.toLocaleDateString();
    // newFactureData['fulldate'] = date;

    newFactureData['priceHT'] = pxHT;
    newFactureData['priceTAX'] = pxTAX;
    newFactureData['priceTTC'] = pxTTC;

    newFactureData['clientkey'] = client.$key;
    newFactureData['clientfullname'] = `${client.firstname} ${client.lastname}`;
    newFactureData['clientFullAdress'] = `${client.street}, ${client.zip} ${client.city}`;
    newFactureData['clientPhone'] = client.phone;
    newFactureData['clientEmail'] = client.email;

    newFactureData['prestationKey'] = prestation.$key;
    newFactureData['prestationFullTitle'] = `${prestation.title} ${prestation.details}`;

    newFactureData['coiffeurKey'] = prestation.$key;
    newFactureData['coiffeurFullName'] = `${coiffeur.firstname} ${coiffeur.lastname}`;    

    newFactureData['eventKey'] = null;
    newFactureData['statut'] = '0';
    newFactureData['moyenDePaiement'] = moyenDePaiement?moyenDePaiement:"";

    console.log(newFactureData);
    this.facturesRef.push(newFactureData).then(_=>
      // console.log('Facture Added')
      this.router.navigate(['/facturations'])
    );
  }


  createEventFacture(eventkey,event,moyenDePaiement,pxHT,pxTAX,pxTTC): void {
    // console.log(event);
    var newFactureData = {}
    newFactureData['timestamp'] = Date.now();    
    newFactureData['ref'] = "001";    
    newFactureData['date'] = event.date;

    newFactureData['priceHT'] = pxHT;
    newFactureData['priceTAX'] = pxTAX;
    newFactureData['priceTTC'] = pxTTC;

    newFactureData['clientkey'] = event.clientKey;
    newFactureData['clientfullname'] = `${event.clientFirstname} ${event.clientLastname}`;
    // newFactureData['clientFullAdress'] = `${client.street}, ${client.zip} ${client.city}`;
    newFactureData['clientPhone'] = event.clientPhone;
    newFactureData['clientEmail'] = event.clientEmail;

    newFactureData['prestationKey'] = event.prestationKey;
    newFactureData['prestationFullTitle'] = `${event.prestationTitle} ${event.prestationDetails}`;

    newFactureData['coiffeurKey'] = event.memberKey;
    newFactureData['coiffeurFullName'] = `${event.memberFirstname} ${event.memberLastname}`;    

    newFactureData['eventKey'] = eventkey?eventkey:0;
    newFactureData['statut'] = '0';
    newFactureData['moyenDePaiement'] = moyenDePaiement?moyenDePaiement:"";

    console.log(newFactureData);
    this.facturesRef.push(newFactureData).then(_=>
      this.router.navigate(['/facturations'])
    );
  }

  createBillFromCart(cart,moypay,promo) {
    console.log(cart);
    var newFactureData = {}

    newFactureData['timestamp'] = Date.now();    
    newFactureData['ref'] = "XXXXXXXXX";    
    newFactureData['promo'] = promo ? promo:0;    
    newFactureData['date'] = cart.date;
    newFactureData['cartkey'] = cart.$key;
    newFactureData['starttime'] = cart.cartstarttime;
    newFactureData['totalHT'] = cart.totalHT;
    newFactureData['totalTAX'] = cart.totalTAX;
    newFactureData['totalTTC'] = cart.totalTTC;
    newFactureData['clientkey'] = cart.clientkey;
    newFactureData['clientfullname'] = cart.clientfullname;
    newFactureData['clientphone'] = cart.clientphone;
    newFactureData['clientemail'] = cart.clientemail;
    newFactureData['statut'] = '0';
    newFactureData['moyendepaiement'] = moypay?moypay:"";    

    console.log(newFactureData);
    this.facturesRef.push(newFactureData).then(_=>
      this.router.navigate(['/facturations'])
    );

    this.cartService.doCart(cart,'paid');
  }



/////////////////////////////////////////////////
  ////////// U P D A T E
/////////////////////////////////////////////////

  // CHANGE FACTURE STATUS
  changeFactureStatut(facture): void {
    var facturekey = facture.$key;
    var currentstatut:number = facture.statut;
    var newstatut = currentstatut+1;
    var date = Date.now();
    var updateData = {};
    updateData[`factures/${facturekey}/statut`] = newstatut;
    // if(!currentstatus) {
    //   updateData[`factures/${facturekey}/startdate`] = date;
    // }
    // if(currentstatus==1) {
    //   updateData[`factures/${facturekey}/enddate`] = date;
    // }
    console.log(updateData);
    this.db.object("/").update(updateData).then(_=>console.log('Facture Statut Updated!'));
  } 

/////////////////////////////////////////////////
  ////////// D E L E T E
/////////////////////////////////////////////////

  // DELETE STATUS
  deleteFacture(facture): void {
    var facturekey = facture.$key;
    const facturePath = `factures/${facturekey}`;
    console.log(facture);
    this.db.object(facturePath).remove();
  }  





}
