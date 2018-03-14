import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Product } from './product';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

@Injectable()
export class ProductsService {

	productsRef: AngularFireList<any>;
  productRef:  AngularFireObject<any>;
  productTypeRef: AngularFireList<any>;
  products: Observable<any[]>;
  productType: Observable<any[]>;
  product:  Observable<any>;

  constructor(private db: AngularFireDatabase, private router: Router) { 
  	this.productsRef = db.list('/products', ref => ref.orderByChild('title'))
    this.productTypeRef = db.list('/productType')
  }

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  ///////////////// G E T ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////  

  getProductWithKey(key: string): Observable<Product> {
    const productPath = `products/${key}`;
    this.product = this.db.object(productPath)
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
    return this.product
  }

  getProductsList() {
    return this.productsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { types: snap.payload.val().types?Object.entries(snap.payload.val().types):null},
        { $key: snap.key }) )
    })
  }

  getProductTypeList() {
    return this.productTypeRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { 
          $key: snap.key, 
          title: snap.payload.val().title,
        }) 
      )
    })
  }


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  /////////////// C R E A T E ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  createProduct(pdctForm: NgForm): void {
    var newproductData = {}
    newproductData['timestamp'] = Date.now();
    newproductData['brand']     = pdctForm.value.pdctBrand?pdctForm.value.pdctBrand:null;
    newproductData['codeEAN']   = pdctForm.value.pdctEAN?pdctForm.value.pdctEAN:null;
    newproductData['ref']       = pdctForm.value.pdctRef?pdctForm.value.pdctRef:null;
    newproductData['title']     = pdctForm.value.pdctTitle?pdctForm.value.pdctTitle:null;
    newproductData['price']     = pdctForm.value.pdctPrice?pdctForm.value.pdctPrice:null;
    newproductData['pxremise']     = pdctForm.value.pdctPxRemise?pdctForm.value.pdctPxRemise:null;
    newproductData['cont']     = pdctForm.value.pdctCont?pdctForm.value.pdctCont:null;
    
    // Insert in products Node
    this.productsRef.push(newproductData);
    this.router.navigate(['/products']);  	
  }



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  ///////////// U P D A T E ////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
 

  updateProduct(product,field,value): void {

    if(value) 
    {
      var productKey = product.$key;
      var salonKey = product.salon.key;

      const productPath = `products/${productKey}/${field}`;

      var updateField = {};
      updateField[productPath]= value;

      console.log(updateField);
      this.db.object("/").update(updateField).then(_=>
         console.log('product MAJ dans ' + productPath)
      );
     }
     else { console.log("Delete Impossible Value Empty") }
  }




////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
  /////////////// D E L E T E ///////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  deleteProduct(product): void {
  	var productkey = product.$key;
    // var salonkey = product.salon.key;
    var types = product.types?product.types:null;

    const productPath = `products/${productkey}`;
    // const productInSalonPath = `salons/${salonkey}/products/${productkey}`;    
    // const productInSalonLookUpPath = `lookUpSalonproducts/${salonkey}/${productkey}`; 

    var deleteData = {};
    deleteData[productPath] = null;
    // deleteData[productInSalonPath] = null;
    // deleteData[productInSalonLookUpPath] = null;

    if(types) {
      var arrayLength = types.length;
      for (var i = 0; i < arrayLength; i++) {
        var typekey = types[i][0];
        var productInTypePath = `productType/${typekey}/products/${productkey}`;
        var productInTypeLookUpPath = `lookUpTypeproducts/${typekey}/${productkey}`;
        deleteData[productInTypePath] = null;
        deleteData[productInTypeLookUpPath] = null;
      }
    }
    // console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );
  }



  removeTypeFromProduct(product,typekey) {

    console.log(product);
    console.log(typekey);

    var productkey = product.$key;
    var typekey = typekey;
    var salonkey = product.salon?product.salon.key:null;

    const productPath = `products/${productkey}/types/${typekey}`;
    const typePath = `productType/${typekey}/products/${productkey}`;
    const typeproductLookUpath = `lookUpTypeproducts/${typekey}/${productkey}`;

    var deleteData = {};
    deleteData[productPath] = null;
    deleteData[typePath] = null;
    deleteData[typeproductLookUpath] = null;

    // console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );

  }


}
