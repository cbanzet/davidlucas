import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './../../core/auth.service';

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
  usrid: string;

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
    "Calendar Component",
    "Cart Component",    
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
    "Création Module",    
    "Database",
    "Développement",
    "Navigation",
    "Optimisation",
    "Style"
  ]

  constructor(private router: Router,
              private location: Location,
              private auth: AuthService,
              private adminService: AdminService) 
  {
    // this.usrId = this.auth.currentUserId();    
  }

  ngOnInit() {
  	this.tasks = this.adminService.getTasksList();
    // this.usrid = this.auth.currentUserId();
  }

  onSubmit(newtaskForm: NgForm) {
    this.adminService.createTask(newtaskForm);
    this.addtaskForm=false;
    this.taskList=true;
  }

  saveTimeSpent(task,time,usrid,usrname) {
    // console.log(task);
    // console.log(time.value);
    // console.log(usrid);
    this.adminService.saveTimeSpent(task,time,usrid,usrname);
  } 

  changeTaskStatus(task) {
    this.adminService.changeTaskStatus(task);	
  }

  deleteTask(task) {
    this.adminService.deleteTask(task);
  }    

}
