import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { User } from 'src/app/models/user.model';
import { User2Service } from 'src/app/services/user2.service';

@Component({
  selector: 'app-userrole-dialog',
  templateUrl: './userrole-dialog.component.html',
  styleUrls: ['../style/main.component.sass']
  //styleUrls: ['./dialog.component.sass']
})
export class UserroleDialogComponent implements OnInit {
  currentUser: any;
  roles?: Role[];
  isInvenDisabled = false;
  isPartDisabled = false;
  isAccDisabled = false;
  isPurDisabled = false;
  isPOSDisabled = false;
  isInvenManager = false;
  isPartManager = false;
  isAccManager = false;
  isPurManager = false;
  isPOSManager = false;
  isInvenUser = false;
  isPartUser = false;
  isAccUser = false;
  isPurUser = false;
  isPOSUser = false;
  isAdmin = false;
  listRoles: any = [];

  constructor(
    public dialogRef: MatDialogRef<UserroleDialogComponent>,
    private globals: Globals,
    private token: TokenStorageService,
    private roleService: RoleService,
    private user2Service: User2Service,
    private tokenStorageService: TokenStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.retrieveRole();
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onAdmin(enable: boolean) {if(enable){this.isAdmin=true;}else{this.isAdmin=false;}}

  onInven(enable: boolean) {if(enable){this.isInvenDisabled=false;}else{this.isInvenDisabled=true;}}
  onInvenManager(enable: boolean) {if(enable){this.isInvenManager=true;}else{this.isInvenManager=false;}}

  onPartner(enable: boolean) {if(enable){this.isPartDisabled=false;}else{this.isPartDisabled = true;}}
  onPartManager(enable: boolean) {if(enable){this.isPartManager=true;}else{this.isPartManager=false;}}

  onPur(enable: boolean) {if(enable){this.isPurDisabled=false;}else{this.isPurDisabled=true;}}
  onPurManager(enable: boolean) {if(enable){this.isPurManager=true;}else{this.isPurManager=false;}}

  onPOS(enable: boolean) {if(enable){this.isPOSDisabled=false;}else{this.isPOSDisabled=true;}}
  onPOSManager(enable: boolean) {if(enable){this.isPOSManager=true;}else{this.isPOSManager=false;}}

  onAcc(enable: boolean) {if(enable){this.isAccDisabled=false;}else{this.isAccDisabled=true;}}
  onAccManager(enable: boolean) {if(enable){this.isAccManager=true;}else{this.isAccManager=false;}}

  retrieveRole(): void {
    this.user2Service.get(this.data.id)
      .subscribe(users => {
        this.checkSlider(users);
    });

    this.roleService.getAll()
      .subscribe(role => {
        this.roles = role;
      })
  }

  checkSlider(user: any): void {
    for(let x=0; x < user.roles.length; x++){
      if(user.roles[x].name == "admin") this.isAdmin=true;
      if(user.roles[x].name == "inventory_user") {this.isInvenUser=true;this.isInvenDisabled=false;}
      if(user.roles[x].name == "inventory_manager") this.isInvenManager=true;
      if(user.roles[x].name == "partner_user") {this.isPartUser=true;this.isPartDisabled=false;}
      if(user.roles[x].name == "partner_manager") this.isPartManager=true;
      if(user.roles[x].name == "purchase_user") {this.isPurUser=true;this.isPurDisabled=false;}
      if(user.roles[x].name == "purchase_manager") this.isPurManager=true;
      if(user.roles[x].name == "pos_user") {this.isPOSUser=true;this.isPOSDisabled=false;}
      if(user.roles[x].name == "pos_manager") this.isPOSManager=true;
      if(user.roles[x].name == "acc_user") {this.isAccUser=true;this.isAccDisabled=false;}
      if(user.roles[x].name == "acc_manager") this.isAccManager=true;
    }
  }
  

  test(): void {
    this.listRoles = [];
        //console.log(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
    if(this.isAdmin){
      this.listRoles.push(this.roles?.filter(role => role.name === "admin").map(role => role._id));
    }
    if(!this.isInvenDisabled){
      if(this.isInvenManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
      }else if(this.isInvenUser){
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
      }
    }
    if(!this.isPartDisabled){
      if(this.isPartManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
      }else if(this.isPartUser){
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
      }
    }
    if(!this.isPurDisabled){
      if(this.isPurManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "purchase_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "purchase_user").map(role => role._id));
      }else if(this.isPurUser){
        this.listRoles.push(this.roles?.filter(role => role.name === "purchase_user").map(role => role._id));
      }
    }
    if(!this.isPOSDisabled){
      if(this.isPOSManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "pos_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "pos_user").map(role => role._id));
      }else if(this.isPOSUser){
        this.listRoles.push(this.roles?.filter(role => role.name === "pos_user").map(role => role._id));
      }
    }
    if(!this.isAccDisabled){
      if(this.isAccManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "acc_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "acc_user").map(role => role._id));
      }else if(this.isAccUser){
        this.listRoles.push(this.roles?.filter(role => role.name === "acc_user").map(role => role._id));
      }
    }
    const dataRole = {
      roles: this.listRoles,
    };
    console.log(dataRole);
    this.user2Service.update(this.data.id, dataRole)
      .subscribe({
        next: (res) => {
          this.tokenStorageService.signOut();
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });

  }
}