import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { ReceivepartDialogComponent } from '../dialog/receivepart-dialog.component';

import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchasedetail } from 'src/app/models/purchasedetail.model';
import { PurchasedetailService } from 'src/app/services/purchasedetail.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PurchaseDialogComponent implements OnInit {
  lock = false;
  edit = false;
  edit_text = "Edit";
  isChecked = false;
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isRes = false;
  term: string;
  openDropDown = false;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  supplierString?: string;
  warehouseString?: string;
  datid?: string;
  datprod?: string;
  datqty?: number;
  datcost?: number;
  datdisc?: number;
  dattax?: number;
  datsub?: number;
  datdate?: string;
  datuom?: string;
  datexpected?: Date;
  totalqty?: number = 0;
  totaldone?: number = 0;
  persenqty?: number = 0;
  thissub?: number = 0;
  thistax?: number = 0;
  thisdisc?: number = 0;
  thistotal?: number = 0;
  ph?: string = 'Ketik disini untuk cari';

  purchaseid?: string;
  purchaseHeader?: string;
  prefixes?: string;
  transid?: string;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'qty_done', 'price_unit', 'discount', 'tax', 'subtotal', 'action'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private logService: LogService,
    private idService: IdService,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data){
      this.lock = true;
      this.retrievePO();
      this.retrievePODetail();
    }
    this.datas = [{product:"",qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
    this.datdate = new Date().toISOString().split('T')[0];;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="purchase_user") this.isPurU=true;
      if(this.globals.roles![x]=="purchase_manager") this.isPurM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPurM || !this.isAdm) this.isRes = true;
    console.log(this.isRes);
    this.retrieveLog();
    this.retrieveData();
    this.currentIndex1 = -1;
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.purchase === this.data);
        this.log = logPR.length;
      })
  }

  retrieveData(): void {
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
      })
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      })
    this.productService.findAllPOReady()
      .subscribe(dataProd => {
        this.products = dataProd;
      })
  }

  retrievePO(): void {
    this.purchaseService.get(this.data)
      .subscribe(dataPO => {
        this.supplierString = dataPO.supplier._id;
        this.warehouseString = dataPO.warehouse;
        this.purchaseHeader = dataPO.id;
        this.thissub = dataPO.amount_untaxed;
        this.thisdisc = dataPO.discount;
        this.thistax = dataPO.amount_tax;
        this.thistotal = dataPO.amount_total;
      })
  }

  retrievePODetail(): void {
    this.purchaseService.get(this.data)
      .subscribe(POId => {
        this.purchaseid = POId.purchase_id;
        this.purchasedetailService.getByPOId(POId.purchase_id)
          .subscribe(POD => {
            if(this.datas[0].product=='') this.datas.splice(0,1);
            for(let x=0;x<POD.length;x++){
              this.totalqty = Number(this.totalqty) + Number(POD[x].qty) ?? 0;
              this.totaldone = Number(this.totaldone) + Number(POD[x].qty_done) ?? 0;
              this.datas.push(POD[x]);
              this.dataSource.data = this.datas;
            }
            this.persenqty = Number(this.totaldone) / Number(this.totalqty) * 100;
          })
      })
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.datprod = product.name;
    this.datid = product.id;
    this.datqty = 1;
    this.datuom = product.suom;
    this.datcost = product.cost ?? 0;
    this.dattax = product.taxout.tax ?? 0;
  }

  pushing(): void {
    if(this.datas[0].product=='') this.datas.splice(0,1);
    if(this.datid){
      const dataPush = {
        id: this.datid, product: this.datprod, qty: this.datqty, qty_done: 0, uom: this.datuom,
        price_unit: this.datcost ?? 0, tax: this.dattax ?? 0, discount: this.datdisc,
        subtotal: (Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) - 
          (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) +
          (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) - 
          (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0)))) ?? 0
      }
      this.datas.push(dataPush);
      this.dataSource.data = this.datas;
      this.ph = "Ketik disini untuk cari";
      this.term = "";
      this.calculateSub();
    }
  }

  deletePODetail(index: number, id: any, product: any): void {
    if(product._id){
      if(this.datas[index].stockmove.length>0){
        this._snackBar.open("Sudah ada Penerimaan Barang!", "Tutup", {duration: 5000});
      }else{
        this.purchasedetailService.get(id)
          .subscribe(resa => {
            this.thissub = Number(this.thissub) - (Number(resa.qty) * Number(resa.price_unit));
            this.thisdisc = Number(this.thisdisc) +
              (Number(resa.discount ?? 0) / 100 * Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0));
            this.thistax = Number(this.thistax) -
              (Number(resa.tax ?? 0)/100 * ((Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0)) - 
              (Number(resa.discount ?? 0) / 100 * Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0)))) ?? 0 + 
              Number(this.thistax??0);
            this.thistotal = Number(this.thistotal) - Number(resa.subtotal);
            const POEd = {
              amount_tax: this.thistax ?? 0,
              amount_untaxed: this.thissub ?? 0,
              amount_discount: this.thisdisc ?? 0,
              amount_total: this.thistotal ?? 0,
              message: this.isUpdated + " ke " + this.thistotal,
              user: this.globals.userid
            };
            this.purchaseService.update(this.data, POEd)
              .subscribe(resb => {
                this.purchasedetailService.delete(id)
                  .subscribe(resc => {
                    this.retrievePO();
                    this.datas.splice(index, 1);
                    this.dataSource.data = this.datas;
                  })
              })
        })
      }
    }else{
      this.thissub = Number(this.thissub) - (Number(this.datas[index].qty) * Number(this.datas[index].price_unit));
      this.thisdisc = Number(this.thisdisc) +
        (Number(this.datas[index].discount ?? 0) / 100 * Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0));
      this.thistax = Number(this.thistax) -
        (Number(this.datas[index].tax ?? 0)/100 * ((Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0)) - 
        (Number(this.datas[index].discount ?? 0) / 100 * Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0)))) ?? 0 + 
        Number(this.thistax??0);
      this.thistotal = Number(this.thistotal) - Number(this.datas[index].subtotal);
      this.datas.splice(index, 1);
      this.dataSource.data = this.datas;
    }
  }

  editPO(): void {
    this.edit = !this.edit;
    if(this.edit) {
      this.edit_text = "Simpan";
      this.lock = false;
    }else {
      this.edit_text = "Edit";
    }
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  calculate(): void {
    this.datsub = (Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) +
      (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0)))) ?? 0;
  }

  calculateSub(): void {
    this.thissub = Number(this.thissub??0) + (Number(this.datqty??0) * Number(this.datcost??0));
    this.thistotal = Number(this.thistotal??0) + Number(this.datsub??0);
    this.thistax = Number(this.thistax??0) +
      (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datcost ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0)))) ?? 0 + Number(this.thistax??0);
    this.thisdisc = Number(this.thisdisc??0) -
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datcost ?? 0));
    this.datid = undefined;
    this.datdisc = undefined;
    this.datprod = undefined;
    this.datqty = undefined;
    this.datcost = undefined;
    this.dattax = undefined;
    this.datsub = undefined;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeBackDialog() {
    this.dialogRef.close(this.purchaseHeader);
  }

  startPO(): void {
    if(this.purchaseid){
      const POEd = {
        amount_tax: this.thistax ?? 0,
        amount_untaxed: this.thissub ?? 0,
        amount_discount: this.thisdisc ?? 0,
        amount_total: this.thistotal ?? 0,
        message: this.isUpdated + " ke " + this.thistotal,
        user: this.globals.userid
      };
      this.purchaseService.update(this.data, POEd)
        .subscribe(resb => {
          this.rollingDetail(this.data);
        })
    }else{
      if(this.supplierString){
        if(this.datas[0].product!=""&&this.datas[0].qty!=""&&!this.edit){
          this.idService.getAll()
            .subscribe({
              next: (ids) => {
                if(ids[0]!.purchase_id! < 10) this.prefixes = '00000';
                else if(ids[0]!.purchase_id! < 100) this.prefixes = '0000';
                else if(ids[0]!.purchase_id! < 1000) this.prefixes = '000';
                else if(ids[0]!.purchase_id! < 10000) this.prefixes = '00';
                else if(ids[0]!.purchase_id! < 100000) this.prefixes = '0';
                let x = ids[0]!.purchase_id!;
                this.purchaseid = "PO"+new Date().getFullYear().toString().substr(-2)+
                '0'+(new Date().getMonth() + 1).toString().slice(-2)+
                this.prefixes+ids[0]!.purchase_id!.toString();
                const purc_id = { purchase_id: x + 1 };
                this.idService.update(ids[0].id, purc_id)
                  .subscribe({
                    next: (res) => {
                      this.insertHeader();
                    },error: (e) => console.error(e)
                  });
              },error: (e) => console.error(e)
            });
        }else this._snackBar.open("Order Kosong", "Tutup", {duration: 5000});
      }else this._snackBar.open("Supplier Kosong", "Tutup", {duration: 5000});
    }
  }

  insertHeader(): void {
    const purcHeaderData = {
      purchase_id: this.purchaseid,
      date: this.datdate,
      expected: this.datexpected,
      discount: this.thisdisc,
      amount_tax: this.thistax ?? 0,
      amount_untaxed: this.thissub ?? 0,
      amount_discount: this.thisdisc ?? 0,
      amount_total: this.thistotal ?? 0,
      supplier: this.supplierString,
      warehouse: this.warehouseString,
      user: this.globals.userid,
      paid: 0,
      delivery_state: 0,
      open: true
    };
    this.purchaseService.create(purcHeaderData)
      .subscribe({
        next: (res) => {
          this.purchaseHeader = res.id;
          this.rollingDetail(res.id);
        },error: (e) => console.error(e)
      });
  }

  rollingDetail(purchid: string): void {
    if(this.datas.length>0){

      if(!this.datas[0].purchase_id){
        this.createDetail(purchid, this.datas[0].qty, this.datas[0].uom,
          this.datas[0].price_unit, this.datas[0].discount, this.datas[0].tax,
          this.datas[0].subtotal, this.datas[0].id, this.datas[0].partner,
          this.datas[0].warehouse);
      }else {
        this.datas.splice(0, 1);
        this.dataSource.data = this.datas;
        this.rollingDetail(purchid);
      }
    }else{
      this.thissub = 0;
      this.thisdisc = 0;
      this.thistax = 0;
      this.thistotal = 0;
      this.closeBackDialog();
    }
  }

  createDetail(purchid:string, qty:number, uom:string, price_unit:number, discount:number, tax:number,
    subtotal:number, product:string, partner:string, warehouse:string): void {
      const purchaseDetail = {
        ids: purchid,
        purchase_id: this.purchaseid,
        qty: qty,
        qty_done: 0,
        uom: uom,
        price_unit: price_unit,
        discount: discount,
        tax: tax,
        subtotal: subtotal,
        product: product,
        partner: partner,
        warehouse: warehouse,
        date: this.datdate,
        user: this.globals.userid
      };
      this.purchasedetailService.create(purchaseDetail)
        .subscribe({
          next: (res) => {
            this.datas.splice(0, 1);
            this.dataSource.data = this.datas;
            this.rollingDetail(purchid);
          },
          error: (e) => console.error(e)
        });
  }

  receiveAll(): void {
    for(let x=0; x< this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty - this.datas[x].qty_done;
    }
    this.purchasedetailService.updateReceiveAll(
      this.globals.userid, this.supplierString, this.warehouseString, this.datdate, this.datas)
      .subscribe(res => {
        this.closeBackDialog();
      })
  }

  receivePartial(): void {
    this.openReceivePartial();
  }

  openReceivePartial() {
    const dialog = this.dialog.open(ReceivepartDialogComponent, {
      width: '90vw',
      height: '80%',
      disableClose: true,
      data: this.purchaseHeader
    }).afterClosed().subscribe(result => {
      if(result){
        this.purchasedetailService.updateReceiveAll(
          this.globals.userid, this.supplierString, this.warehouseString, result[0].date, result)
            .subscribe(res => {
              this.closeBackDialog();
            })
      }
    });
  }
}
