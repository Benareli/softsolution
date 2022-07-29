import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { SMDetailDialogComponent } from '../dialog/sm-detail-dialog.component';

@Component({
  selector: 'app-stockmove',
  templateUrl: './stockmove.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class StockmoveComponent implements OnInit {
  stockmoves?: Stockmove[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  datas?: any;
  
  //View
  currentStockmove: Stockmove = {};
  currentIndex = -1;
  searchStockmove='';
  
  //Table
  displayedColumns: string[] = ['transid','origin','date'];
  dataSource = new MatTableDataSource<Stockmove>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private stockmoveService: StockmoveService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.stockmoveService.getAll()
      .subscribe(stockmove => {
        this.stockmoves = Array.from(new Map(stockmove.reverse().map(item => [item.trans_id, item])).values());
        this.dataSource.data = Array.from(new Map(stockmove.reverse().map(item => [item.trans_id, item])).values());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.datas = Array.from(new Set(stockmove.map((itemInArray) => itemInArray.trans_id)))
        //this.datas = Array.from(new Map(stockmove.reverse().map(item => [item.trans_id, item])).values()).reverse();
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Stockmove) {
    const dialog = this.dialog.open(SMDetailDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

}
