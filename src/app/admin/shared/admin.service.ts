import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operator/map';

@Injectable()
export class AdminService {

  // private taskPath = '/tasks';

  tasksRef: AngularFireList<any>;


  constructor(
    private db: AngularFireDatabase,
    private router: Router) 
  { 
    this.tasksRef = db.list('/tasks', ref => ref.orderByChild('status').limitToLast(150));
  }


////////////////////////////////////////////////////////////////////////////////
////////////////////////// G E T ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  getTasksList() {
    return this.tasksRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(),
        // { length: "30"},
        { length: snap.payload.val().enddate?(Math.round((snap.payload.val().enddate-snap.payload.val().startdate)/1000/60/60)*100)/100:0 },
        { $key: snap.key }) )
    })
  }

////////////////////////////////////////////////////////////////////////////////
/////////////////// C R E A T E ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  createTask(newTaskForm: NgForm): void {
    // console.log(newTaskForm.value);
    var newTaskData = {}
    newTaskData['timestamp'] = Date.now();    
    newTaskData['details'] = newTaskForm.value.newTaskDetails?newTaskForm.value.newTaskDetails:"";
    newTaskData['status'] = 0;
    newTaskData['time'] = newTaskForm.value.newTaskTime?newTaskForm.value.newTaskTime:"";
    newTaskData['component'] = newTaskForm.value.newTaskComponent?newTaskForm.value.newTaskComponent:"";
    newTaskData['action'] = newTaskForm.value.newTaskAction?newTaskForm.value.newTaskAction:"";
    console.log(newTaskData);
    this.tasksRef.push(newTaskData).then(_=>'Task Added');
  }


////////////////////////////////////////////////////////////////////////////////
/////////////////// U P D A T E ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  // CHANGE TASK STATUS
  changeTaskStatus(task): void {
    var taskkey = task.$key;
    var currentstatus:number = task.status;
    var newstatus = currentstatus+1;
    var date = Date.now();
    var updateData = {};
    updateData[`tasks/${taskkey}/status`] = newstatus;
    if(!currentstatus) {
      updateData[`tasks/${taskkey}/startdate`] = date;
    }
    if(currentstatus==1) {
      updateData[`tasks/${taskkey}/enddate`] = date;
    }
    console.log(updateData);
    this.db.object("/").update(updateData).then(_=>console.log('Task Updated!'));
  } 


  // SAVE TIME SPENT ON TASK
  saveTimeSpent(task, time, usrid, usrname):void {
    var taskkey = task.$key; 
    var spenttime = time.value?time.value:0;  
    var usrname = usrname?usrname:"No one";
    if(spenttime) {
      var updateData = {};
      updateData[`tasks/${taskkey}/usrname`] = usrname; 
      updateData[`tasks/${taskkey}/usrid`] = usrid; 
      updateData[`tasks/${taskkey}/timespent`] = spenttime; 
      this.db.object("/").update(updateData).then(_=>console.log('Task Time Spent Saved!'));         
    }
    else {
      console.log("No time specify")
    }
  }



////////////////////////////////////////////////////////////////////////////////
//////////////////// D E L E T E ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


  deleteTask(task): void {
    var taskkey = task.$key;
    const taskPath = `tasks/${taskkey}`;
    this.db.object(taskPath).remove();
  }  



}