import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FacturationService } from './../shared/facturation.service';
import { ClientService } from './../../clients/shared/client.service';
import { CartService  } from './../../cart/shared/cart.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.css']
})
export class PrintBillComponent implements OnInit {

	bill;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
  	private clientService: ClientService,
    private cartService: CartService,
    private location: Location, 	
  	private facturationService: FacturationService
  	) { }

  ngOnInit() {
    this.bill = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.facturationService.getBillWithKey(params.get('id')));    	
  }


  print_page() {
     window.print();
     // this.router.navigate(['/calendar/'])
  }


}
