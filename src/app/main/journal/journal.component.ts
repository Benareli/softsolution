import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Journal } from 'src/app/models/journal.model';
import { JournalService } from 'src/app/services/journal.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { EntryDialogComponent } from '../dialog/entry-dialog.component';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class JournalComponent implements OnInit {
  journals?: Journal[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  datas?: any;
  
  //Table
  displayedColumns: string[] = ['journid','origin','amount','date'];
  dataSource = new MatTableDataSource<Journal>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private journalService: JournalService,
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
    this.retrieveData();
  }

  retrieveData(): void {
    this.journalService.getAll()
      .subscribe(journal => {
        this.journals = Array.from(new Map(journal.reverse().map(item => [item.journal_id, item])).values());
        this.dataSource.data = Array.from(new Map(journal.reverse().map(item => [item.journal_id, item])).values());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Journal) {
    const dialog = this.dialog.open(EntryDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

}
