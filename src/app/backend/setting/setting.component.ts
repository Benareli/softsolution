import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { RegisterComponent } from '../../landing/register/register.component';
import { UserroleDialogComponent } from '../../main/dialog/userrole-dialog.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { User } from 'src/app/models/user.model';
import { User2Service } from 'src/app/services/user2.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../main/style/main.component.sass']
})
export class SettingComponent implements OnInit {
  stores?: Store[];
  users?: User[];
  ids?: Id[];
  idh?: any;
  settingid?: string;
  cost_general?: boolean = true;
  pos_shift?: boolean = false;
  restaurant?: boolean = false;
  comp_name?: string;
  comp_addr?: string;
  comp_phone?: string;
  comp_email?: string;
  isAdm?: boolean = false;

  //Table Store
  displayedColumns: string[] = ['name','address','phone','warehouse'];
  dataSource = new MatTableDataSource<Store>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Table User
  displayedColumnsUser: string[] = ['name'];
  dataSourceUser = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true }) paginatorUser!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortUser!: MatSort;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private token: TokenStorageService,
    private settingService: SettingService,
    private storeService: StoreService,
    private user2Service: User2Service,
    private idService: IdService,
    private possessionService: PossessionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveSetting();
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAdm) this.router.navigate(['/']);
  }

  retrieveSetting(): void {
    this.settingService.getAll()
      .subscribe(setting => {
        this.settingid = setting[0].id;
        this.cost_general = setting[0].cost_general;
        this.comp_name = setting[0].comp_name;
        this.comp_addr = setting[0].comp_addr;
        this.comp_phone = setting[0].comp_phone;
        this.comp_email = setting[0].comp_email;
        this.pos_shift = setting[0].pos_shift;
        this.restaurant = setting[0].restaurant;
      })
    this.storeService.getAll()
      .subscribe(store => {
        this.dataSource.data = store;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    this.user2Service.getAll()
      .subscribe(user2 => {
        this.dataSourceUser.data = user2;
        this.dataSourceUser.paginator = this.paginatorUser;
        this.dataSourceUser.sort = this.sortUser;
      })
    this.idService.getAll()
      .subscribe(ids => {
        this.idh = ids[0];
      })
  }

  save1(): void {
    const save1 = {
      comp_name: this.comp_name,
      comp_addr: this.comp_addr,
      comp_phone: this.comp_phone,
      comp_email: this.comp_email
    }

    this.settingService.update(this.settingid, save1)
        .subscribe({
          next: (res) => {
            this.retrieveSetting();
          },
          error: (e) => console.error(e)
        });
  }

  save2(): void {
    const save2 = {
      cost_general: this.cost_general
    }

    this.settingService.update(this.settingid, save2)
      .subscribe(res => {
        this.retrieveSetting();
        this.reloadPage();
      });
  }

  save3(): void {
    this.possessionService.getAllOpen()
      .subscribe(poss => {
        if(poss.length>0){
          this._snackBar.open("Tidak bisa menutup karena ada POS Session Terbuka", "Tutup", {duration: 10000});
          this.retrieveSetting();
        }else{
          const save3 = {
            pos_shift: this.pos_shift,
            restaurant: this.restaurant,
          }
          this.settingService.update(this.settingid, save3)
            .subscribe({
              next: (res) => {
                this.retrieveSetting();
                this.reloadPage();
              },
              error: (e) => console.error(e)
            });
        }
      })
  }

  addUser(): void {
    const dialog = this.dialog.open(RegisterComponent, {
      width: '50%',
      height: '50%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveSetting());
  }

  userRole(row: User): void {
    const dialog = this.dialog.open(UserroleDialogComponent, {
      width: '90%',
      height: '98%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveSetting());
  }

  reloadPage(): void {
    window.location.reload();
  }
}
