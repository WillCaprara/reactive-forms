import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Product, Item } from '../../models/product.interface';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';

import { StockValidators } from './sotck-inventory.validators';

import { StockInventoryService } from '../../services/stock-inventory.service';

@Component({
  selector: 'stock-inventory',
  styleUrls: ['stock-inventory.component.scss'],
  templateUrl: 'stock-inventory.component.html'
})
export class StockInventoryComponent implements OnInit {
  products: Product[];
  productMap: Map<number, Product>;
  total: number;

  form = this.fb.group({
    store: this.fb.group({
      branch: ['', [Validators.required, StockValidators.checkBranch], [this.validateBranch.bind(this)]],
      code: ['', Validators.required]
    }),
    selector: this.createStock({}),
    stock: this.fb.array([])
  }, { validator: StockValidators.checkStockExists });

  constructor(
    private fb: FormBuilder,
    private stockService: StockInventoryService
  ){}

  ngOnInit(): void {
    const cart = this.stockService.getCartItems();
    const products = this.stockService.getProducts();
    
    Observable
      .forkJoin(cart, products)
      .subscribe(([cart, products]: [Item[], Product[]]) => {
        //This is the .map javascript method.
        //When we iterate this collection we're going to get each product; from here because the way the map api works we want to do is return the product.id, so this will allow us to essentially look it up by the id followed by the product which we will set as the value.
        const myMap = products
          .map<[number, Product]>(product => [product.id, product]);
        
        this.productMap = new Map<number, Product>(myMap);
        this.products = products;
        cart.forEach(item => this.addStock(item));

        this.calculateTotal(this.form.get('stock').value);
        this.form.get('stock')
          .valueChanges
          .subscribe(value => this.calculateTotal(value));
      });
  }

  validateBranch(control: AbstractControl) {
    return this.stockService
      .checkBranchId(control.value)
      .map((response: boolean) => {
        //console.log(response ? null: { unknownBranch: true });
        response ? null: { unknownBranch: true };
      });
  }

  calculateTotal(value: Item[]) {
    const total = value.reduce((prev, next) => {
      return prev + (next.quantity * this.productMap.get(next.product_id).price);
    }, 0);

    this.total = total;
  }

  createStock(stock) {
    return this.fb.group({
      product_id: parseInt(stock.product_id, 10) || '',
      quantity: stock.quantity || 10
    })
  }

  addStock(stock) {
    //Gain access to the control that we want to push the added stock into.
    const control = this.form.get('stock') as FormArray;
    control.push(this.createStock(stock));
  }

  removeStock({ group, index }: { group: FormGroup, index: number }) {
    const control = this.form.get('stock') as FormArray;
    control.removeAt(index);
  }

  onSubmit() : void {
    console.log('Submit: ' + this.form.value);
  }
}