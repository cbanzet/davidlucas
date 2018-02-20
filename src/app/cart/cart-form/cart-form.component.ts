import { Component, OnInit } from '@angular/core';

import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { PrestationService } from './../../prestations/shared/prestation.service';
import {  CartService  } from './../../cart/shared/cart.service';
import { NgForm } from '@angular/forms';
import { Cart } from './../../cart/shared/cart';

@Component({
  selector: 'app-cart-form',
  templateUrl: './cart-form.component.html',
  styleUrls: ['./cart-form.component.css']
})
export class CartFormComponent implements OnInit {

  
	prestations: any;
  forfaits: any;
  data: Array<Cart> = [];
  tab = ['un', 'deux'];
  prestationKeyAdded;

  totalHT:number=0;
  totalTAX:number=0;
  totalTTC:number=0;

	showAddPrestaSection:boolean=false;
	showAddPrestaSectionButton:boolean=true;
	showRemovePrestaSectionButton:boolean=false;

  showAddForfaitSection:boolean=false;
  showAddForfaitSectionButton:boolean=true;
  showRemoveForfaitSectionButton:boolean=false;

  constructor(
    private prestationService: PrestationService,
    private forfaitService: ForfaitService ,
    private cartService: CartService
  ) 
  {
  	this.prestations = this.prestationService.getPrestationsList();
    this.forfaits = this.forfaitService.getForfaitsList();
  }

  ngOnInit() {
  }

  insertItemInCart(key,title,price,time){
    this.data.push(new Cart(key,title,price,time));
    this.sumTablePrice('add',price);
    // console.log(this.data);
  }
  formatBeforeInsert(type,data) {
    var key = data.$key?data.$key:0;
    var title = data.title?data.title:0;
    var time = data.time?data.time:0;
    var price = type=='prestation' ? data.priceTeam : data.price;
    
    if(key&&title&&price&&time) {this.insertItemInCart(key,title,price,time);}
    else {console.log("Entrée incomplète")}
  }



  getTotalHT(addOrRemove,px) {
    if(addOrRemove=='add'){
      this.totalHT = Math.round((px+this.totalHT)*100)/100;
    }
    else if(addOrRemove=='remove') {
      this.totalHT = Math.round((this.totalHT-px)*100)/100;
    }
  }
  getTotalTAX() {
    this.totalTAX = Math.round((this.totalHT*0.2)*100)/100;    
  }
  getTotalTTC() {
    this.totalTTC = this.totalTAX + this.totalHT;
  }
  sumTablePrice(addOrRemove,px) {
    this.getTotalHT(addOrRemove,px);
    this.getTotalTAX();
    this.getTotalTTC();
  }

  createCart() {
    // console.log(this.data);
    // Empty Space for Cart created from Calendar Module
    // this.cartService.createCartFromCartForm(this.data,this.totalHT,this.totalTAX,this.totalTTC);    
  }

  deleteProduct(index: number, px:number) {
    console.log(index);
    this.sumTablePrice('remove',px);
    this.data.splice(index, 1);
  }

}