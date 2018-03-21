import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Product } from './../shared/product';
import { Type } from './../shared/type';

import { ProductsService } from './../shared/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit {

  products: Observable<any[]>;
  types: Observable<any[]>;
  typelist: Observable<any[]>;
  typeShow:any;

  titleField = "title";
  detailsField = "details";
  price = "price";

  ShowAddTypeBut:boolean = true;
  showTypeSelect:boolean = false;
  showPrestaTypeList:boolean = true;
  typeselected: string ;
  filtre: Object;

  constructor(private productService: ProductsService) 
  {
    this.products = this.productService.getProductsList();
    // this.types = this.productService.getPrestaTypeListWithPrestaDetails();

    this.types = this.productService.getProductTypeList();
    // this.oldprestas = this.productService.getServicesList();
  }

  ngOnInit() {
    this.typeselected = '';
    this.showTypeSelect = true;    
  }


  deleteProduct(product) {
  	this.productService.deleteProduct(product);
  }

  updateField(key,field,value) {
    this.productService.updateProduct(key,field,value);
  }

  typeSelected(type: Type) {
    this.typeselected = type.title;
    this.showTypeSelect = true;
    this.filtre = {
      types: [[ '' , this.typeselected ]]
    };
    console.log( this.typeselected);
  }  

}