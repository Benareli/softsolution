import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { PurchaseDialogComponent } from '../dialog/purchase-dialog.component';

import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class PurchaseComponent implements OnInit {
  partners?: Partner[];
  warehouses?: Warehouse[];
  purchases?: Purchase[];
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isShow = false;

  supplierString?: string;
  warehouseString?: string;

  //Table
  displayedColumns: string[] = 
  ['po', 'date', 'supplier', 'subtotal', 'disc', 'tax', 'total'];
  dataSource = new MatTableDataSource<Purchase>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private router: Router,
    private globals: Globals,
    private dialog: MatDialog,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="purchase_user") this.isPurU=true;
      if(this.globals.roles![x]=="purchase_manager") this.isPurM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPurU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.purchaseService.getAll()
      .subscribe(dataPur => {
        this.purchases = dataPur;
        this.dataSource.data = dataPur;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
      })
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      })
  }

  applyFilter(event: Event) {
    /*const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();*/
  }

  addPurchase(): void {
    const dialog = this.dialog.open(PurchaseDialogComponent, {
      width: '100vw',
      height: '100%',
      disableClose: true,   
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }

  openDialog(id: string) {
    const dialog = this.dialog.open(PurchaseDialogComponent, {
      width: '100vw',
      height: '100%',
      disableClose: true,
      data: id
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }
}
