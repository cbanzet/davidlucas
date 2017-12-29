import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';
import { Member } from './member';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operator/map';

@Injectable()
export class MemberService {

  private basePath = '/members';
  private memberPath = '/members';
  private rolePath = '/memberRole';
  private salonPath = '/salons';

  membersRef: AngularFireList<any>;
  memberRef:  AngularFireObject<any>;
  members: Observable<any[]>; //  list of objects
  member:  Observable<any>;   //   single object

  rolesRef: AngularFireList<any>;
  roleRef: AngularFireObject<any>;
  roles: Observable<any>;
  role: Observable<any>;

  constructor(
    private db: AngularFireDatabase,
    private router: Router) 
  { 
  	this.membersRef = db.list('/members');
    this.rolesRef = db.list('/memberRole'); 

  	// this.members = this.membersRef.snapshotChanges().map(arr => {
   //    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
   //  })
  }


  ////// G E T ////////////////


  // Return an observable list with optional query
  getMembersList() {
    return this.membersRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })    
  }

  getRoles() {
    return this.rolesRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), {$key: snap.key}))
    })
  }

  // getEventsOfMember(key) {
  //   return this.db.list('events/'+)
  // }

  // Return a single observable member
  getMember(key: string): Observable<Member> {
    const memberPath = `${this.basePath}/${key}`;
    this.member = this.db.object(memberPath).valueChanges();
    return this.member
  }

  // Return Member with Key
  getMemberWithKey(key: string): Observable<Member> {
    const memberPath = `${this.basePath}/${key}`;
    this.member = this.db.object(memberPath)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      });
    return this.member
  } 



  ////// C R E A T E ////////////////


  // Create new member
  createMember(newMemberForm: NgForm): void {
    console.log(newMemberForm.value);
    var salonKey = "1";
    var salonTitle = "David Lucas Paris";
    var roleKey = newMemberForm.value.pickedMemberRole.$key;
    var roleTitle = newMemberForm.value.pickedMemberRole.title;
    var newMemberData = {}
    newMemberData['timestamp'] = Date.now();
    newMemberData['firstname'] = this.emptyField(newMemberForm.value.newMemberfirstname);
    newMemberData['lastname'] = this.emptyField(newMemberForm.value.newMemberlastname);
    newMemberData['birthdate'] = this.emptyField(newMemberForm.value.newMemberbirthdate);
    newMemberData['email'] = this.emptyField(newMemberForm.value.newMemberemail);
    newMemberData['phone'] = this.emptyField(newMemberForm.value.newMemberphone);
    newMemberData['street'] = this.emptyField(newMemberForm.value.newMemberstreet);
    newMemberData['zip'] = this.emptyField(newMemberForm.value.newMemberzip);
    newMemberData['city'] = this.emptyField(newMemberForm.value.newMembercity);
    newMemberData['role'] = {
        key: roleKey,
        title: roleTitle
    };
    newMemberData['salon'] = {
        key: salonKey,
        title: salonTitle
    };

    // DEFINE PATHS
    var newMemberKey = this.membersRef.push(newMemberData).key;
    const roleMemberPath = `memberRole/${roleKey}/members/${newMemberKey}`;
    const salonMemberPath = `salons/${salonKey}/members/${newMemberKey}`;

    var updateData = {};
    updateData[roleMemberPath]= newMemberData;
    updateData[salonMemberPath]= newMemberData;

    console.log(updateData);
    this.db.object("/").update(updateData).then(_=> console.log('Data Updated!'));
    // INSERT IN LOOK UP
    this.db.list('/lookUpSalonMember').update(salonKey, {[newMemberKey]:true});
    this.db.list('/lookUpRoleMember').update(roleKey, {[newMemberKey]:true});
    this.router.navigate(['/members']);      
  }


  ///////////// D E L E T E ////////////////



  // Delete a single Member
  deleteMember(member): void {
    var keyMember = member.$key;
    var keyRole = member.role.key;
    var keySalon = member.salon.key;
    // console.log(member);
    const memberPath = `${this.memberPath}/${keyMember}`;
    const rolememberPath = `${this.rolePath}/${keyRole}/members/${keyMember}`;
    const salonmemberPath = `${this.salonPath}/${keySalon}/members/${keyMember}`;
    const lookUpRoleMember = `lookUpRoleMember/${keyRole}/${keyMember}`;
    const lookUpSalonMember = `lookUpSalonMember/${keySalon}/${keyMember}`;

    this.db.object(memberPath).remove().then(_=> console.log("Remove From Member "+memberPath));
    this.db.object(rolememberPath).remove().then(_=> console.log("Remove From Role Member "+rolememberPath));
    this.db.object(salonmemberPath).remove().then(_=> console.log("Remove From Salon Member "+salonmemberPath));
    this.db.object(lookUpRoleMember).remove().then(_=> console.log("Remove From Look Up Role Member"));
    this.db.object(lookUpSalonMember).remove().then(_=> console.log("Remove From Look Up Salon Member"));
    this.router.navigate(['/members']);      
  }



  ///////////// U P D A T E ////////////////

 

  // Update Member's data
  updateMember(member,field,value): void {

    var memberKey = member.$key;
    var roleKey = member.role.key;
    var salonKey = member.salon.key;

    // var managerKey = member.role.manager?member.role.agents.key:0;
    // var coiffeurKey = member.role.artists?member.role.artists.key:0;

    const memberPath = `${this.memberPath}/${memberKey}/${field}`;
    const memberInRolePath = `${this.rolePath}/${roleKey}/members/${memberKey}/${field}`;
    const memberInSalonPath = `${this.salonPath}/${salonKey}/members/${memberKey}/${field}`;

    var updateField = {};
    updateField[memberPath]= value;
    updateField[memberInRolePath]= value;
    updateField[memberInSalonPath]= value;
    // IF COIFFEUR 
    // if(roleKey=='1')
    // {
    //   updateData[artistInInstruPath]= value;
    //   //WITH MANAGER
    //   if(agentKey) { 
    //     updateData[artistInAgentPath] = value;
    //     updateData[artistInAgentRolePath] = value;
    //   }
    // }
    // console.log(updateData);
    this.db.object("/").update(updateField).then(_=>
       console.log('Data Updated in ' + memberPath + memberInRolePath + memberInSalonPath)
    );
  }













  // Default error handling for all actions
  private handleError(error) {
    console.log(error)
  }



  // Stupid Functions
  emptyField(n: string) {
    if(!n || n=='') return '';
    else return n;
  }



}