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

import * as moment from 'moment'; 
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class FacturationService {

	facturesRef       : AngularFireList<any>;

  historyRef        : AngularFireList<any>;
  billsRef          : AngularFireList<any>;
  dataFromEventKey  : Observable<any>;
  eventPrice        : Observable<any>;
  lastBillRef       : AngularFireList<any>;

  constructor(
    private cartService: CartService,
    private db: AngularFireDatabase, 
    private router: Router) 
  {
  	// this.facturesRef= db.list('/bills', ref => ref.orderByChild('timestamp'));
    this.billsRef    = db.list('/bills', ref => ref.orderByChild('timestamp'));
    this.historyRef  = db.list('/history', ref => ref.orderByChild('timestamp'));
    this.lastBillRef = db.list('/bills', ref => ref.orderByChild('timestamp').limitToLast(1));
  }

/////////////////////////////////////////////////
  ////////// G E T
/////////////////////////////////////////////////

  getBillsList() {
    return this.billsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { arrprestas: snap.payload.val().prestations?Object.values(snap.payload.val().prestations):0},
        { $key: snap.key }) )
    })
  }

  getNewBillRef(timestamp) {
    return this.lastBillRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        // snap.payload.val(),
        { 
           ref: snap.payload.val().ref 
                ? `${this.getDateForBillRef(timestamp)}-${Number(snap.payload.val().ref.split('-')[3])+1}` 
                : `${this.getDateForBillRef(timestamp)}-XX` 
         }
        // { $key: snap.key }
      ))
    })
  }

  getDateForBillRef(timestamp) {
    var day = moment(timestamp).date();
    var month = (moment(timestamp).month())+1;
    var year = moment(timestamp).year(); 
    var date = `${year}-${month}-${day}`;
    return date;
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



  createBillFromCart(cart,moypay,promo,ttc,ht,tva,ref) {

    var cartkey                    = cart.$key;
    var promo                      = promo ? promo:null;

    var newBillData                = {}
    newBillData['timestamp']       = Date.now();    
    newBillData['ref']             = ref;    
    newBillData['promo']           = promo;
    newBillData['date']            = cart.date;
    newBillData['cartkey']         = cartkey;
    newBillData['starttime']       = cart.cartstarttime;
    newBillData['totalHT']         = ht ? ht : cart.totalHT ;
    newBillData['totalTAX']        = tva ? tva : cart.totalTAX;
    newBillData['totalTTC']        = ttc ? ttc : cart.totalTTC;
    newBillData['clientkey']       = cart.clientkey;
    newBillData['clientfullname']  = cart.clientfullname;
    newBillData['clientphone']     = cart.clientphone;
    newBillData['clientemail']     = cart.clientemail;
    newBillData['statut']          = '0';
    newBillData['moyendepaiement'] = moypay?moypay:"nc";   

    var billkey                    = this.billsRef.push(newBillData).key;
    
    var updateData                 = {};
    var clientPath                 = `clientes/${cart.clientkey}/billhistory/${billkey}`;
    updateData[clientPath]         = newBillData;

    // Insertion des Prestations en Sous-Noeud de la facture et dans le membre
    if(cart.prestas.length){
      for (let i = 0 ; i < cart.prestas.length ; i++ ) 
      {
        var prestakey          = cart.prestas[i].prestationkey ? cart.prestas[i].prestationkey : null;
        var prestatitle        = cart.prestas[i].prestationtitle ? cart.prestas[i].prestationtitle : null;
        var memberkey          = cart.prestas[i].memberkey ? cart.prestas[i].memberkey : null;        
        var membername         = cart.prestas[i].membername ? cart.prestas[i].membername : null;        

        var prestaprice        = promo ? 
                    Math.round((cart.prestas[i].price - (cart.prestas[i].price * promo))*100)/100 : 
                    cart.prestas[i].price;

        var prestaHistory           = {};
        prestaHistory['prestakey']  = prestakey;
        prestaHistory['cartkey']    = cartkey;
        prestaHistory['billkey']    = billkey;
        prestaHistory['type']       = 'prestation';
        prestaHistory['price']      = prestaprice;
        prestaHistory['date']       = cart.date;
        prestaHistory['title']      = prestatitle;

        var historykey  = this.historyRef.push(prestaHistory).key; 

        var memberPath         = `members/${memberkey}/billhistory/${historykey}`;
        updateData[memberPath] = prestaHistory;
        this.addPrestaToBill(billkey,prestakey,memberkey,membername,prestaprice);
      }
    }

    // Insertion des Produits en Sous-Noeud de la facture et dans le membre
    if(cart.pdcts){
      for (let i = 0 ; i < cart.pdcts.length ; i++ ) 
      {
        var productkey         = cart.pdcts[i].key ? cart.pdcts[i].key : null;
        var producttitle       = cart.pdcts[i].title ? cart.pdcts[i].title : null;
        var memberkey          = cart.pdcts[i].memberkey ? cart.pdcts[i].memberkey : null;        
        var membername         = cart.pdcts[i].membername ? cart.pdcts[i].membername : null;        
        var productprice       = promo ? 
                    Math.round((cart.pdcts[i].price - (cart.pdcts[i].price * promo))*100)/100 : 
                    cart.pdcts[i].price;

        var prdctHistory           = {};
        prdctHistory['productkey'] = productkey;
        prdctHistory['cartkey']    = cartkey;
        prdctHistory['billkey']    = billkey;
        prdctHistory['type']       = 'product';
        prdctHistory['price']      = productprice;
        prdctHistory['date']       = cart.date;
        prdctHistory['title']      = producttitle;

       var historykey  = this.historyRef.push(prdctHistory).key; 

        var memberPath         = `members/${memberkey}/billhistory/${historykey}`;
        updateData[memberPath] = prdctHistory;
        this.addProductToBill(billkey,productkey,memberkey,membername,productprice);
      }
    }    
    
    var cartPath               = `carts/${cartkey}/billkey`;
    var billRefInCart          = `carts/${cartkey}/billref`;    
    updateData[cartPath]       = billkey;
    updateData[billRefInCart]  = ref;

    this.db.object("/").update(updateData).then( _=> console.log(updateData));
    this.cartService.doCart(cart,'paid');
    this.router.navigate(['/calendar'])
  }


  addPrestaToBill(billkey,prestakey,memberkey,membername,price) {
    var newPrestaData              = {};
    newPrestaData['prestationkey'] = prestakey;
    newPrestaData['price']         = price?price:0;
    newPrestaData['memberkey']     = memberkey;
    newPrestaData['membername']    = membername;

    const prestaInBillPath = `bills/${billkey}/prestations/${prestakey}/`;
    var updateData = {};
    updateData[prestaInBillPath] = newPrestaData;
    this.db.object("/").update(updateData).then(_=> console.log(updateData));    
  }


  addProductToBill(billkey,productkey,memberkey,membername,productprice) {
    var newPrdctData           = {};
    newPrdctData['productkey'] = productkey;
    newPrdctData['price']      = productprice?productprice:0;
    newPrdctData['memberkey']  = memberkey;
    newPrdctData['membername'] = membername;

    const productInBillPath = `bills/${billkey}/products/${productkey}/`;
    var updateData = {};    
    updateData[productInBillPath] = newPrdctData;    
    this.db.object("/").update(updateData).then(_=> console.log(updateData));    
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
