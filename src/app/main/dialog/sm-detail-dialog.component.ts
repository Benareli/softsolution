import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';

@Component({
  selector: 'app-sm-detail-dialog',
  templateUrl: './sm-detail-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class SMDetailDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  stockmoves?: Stockmove[];

  a = 0; b = 0;
  transidtitle?: string;
  log = 0;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'uom', 'date', 'wh'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  constructor(
    public dialogRef: MatDialogRef<SMDetailDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private stockmoveService: StockmoveService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data){
      this.transidtitle = this.data.trans_id;
      this.stockmoveService.getTransId(this.data.trans_id)
        .subscribe(smti => {
          this.datas = smti;
          this.dataSource.data = this.datas;
        })
    }
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
