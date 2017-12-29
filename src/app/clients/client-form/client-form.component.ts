import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  private clientsRef: AngularFireList<any>;
  clients: Observable<any[]>;
 	m:string;
 	// newRef:string;

  constructor(private router: Router,
  						private db: AngularFireDatabase,
              private location: Location) { 
		this.clientsRef = db.list('clientes');   
	}

  ngOnInit() {
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);

  emptyField(n: string) {
  	if(!n) { this.m = ''; }
  	else if (n=='') { this.m = '' }
  	else this.m=n;
  	// return this.m;
  	return this.m;  
  }

  onSubmit(newClientForm: NgForm) {
    // console.log(newClientForm.valid);  // false
    var newRef = this.clientsRef.push({
    	timestamp: Date.now(),
    	firstname: 			this.emptyField(newClientForm.value.newClientfirstname),
    	lastname: 			this.emptyField(newClientForm.value.newClientlastname),
    	birthdate: 			this.emptyField(newClientForm.value.newClientbirthdate),
    	email: 					this.emptyField(newClientForm.value.newClientemail),
    	phone: 					this.emptyField(newClientForm.value.newClientphone),
    	street: 				this.emptyField(newClientForm.value.newClientstreet),
    	zip: 						this.emptyField(newClientForm.value.newClientzip),
    	city: 					this.emptyField(newClientForm.value.newClientcity),
    	fichetechnique: this.emptyField(newClientForm.value.newClientfichetechnique)
    }).key;
    this.router.navigate(['/clients']);
    console.log(newClientForm.value);  // { first: '', last: '' }
    console.log(newRef); // Key of added element
  }


  goBack(): void {
    this.location.back();
  }

}