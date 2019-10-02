import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  products: Product[];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productService
      .getProducts()
      .subscribe((results: Array<Product>) => {
        this.products = results.sort((a, b) => { 
          let x = a.productName.toLowerCase();
          let y = b.productName.toLowerCase();
          return (x < y) ? -1 : ((x > y) ? 1 : 0); 
        });
      })
  }
}
