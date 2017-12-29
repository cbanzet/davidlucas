import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AdminService } from './../shared/admin.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

	tasks: Observable<any[]>;
	taskList:boolean=true;
	addtaskForm:boolean=false;	

  times = [
    "1",
    "3",
    "6",
    "24",
    "48",
    "72"
  ]

  components = [
    "Admin Component",    
    "Clients Component",
    "Core Component",
    "Events Component",
    "Facturation Component",
    "Members Component",
    "Navigation",
    "Prestations Component",
    "Style"
  ]

  actions = [
    "Animations",
    "Bug Fixing",  
    "Création Component",
    "Création Fonction",
    "Création Autocomplete MatFormField", 
    "Database",
    "Développement",
    "Navigation",
    "Style"
  ]

  constructor(private router: Router,
              private location: Location,
              private adminService: AdminService) { }

  ngOnInit() {
  	this.tasks = this.adminService.getTasksList();  	
  }

  onSubmit(newtaskForm: NgForm) {
    this.adminService.createTask(newtaskForm);
    this.addtaskForm=false;
    this.taskList=true;
  } 

  changeTaskStatus(task) {
    this.adminService.changeTaskStatus(task);	
  }

  deleteTask(task) {
    this.adminService.deleteTask(task);
  }    

}
