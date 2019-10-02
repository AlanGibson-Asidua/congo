import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { BasketService } from '../basket.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  constructor(
    private basketService: BasketService
  ) { }

  ngOnInit() {
  }

  addToBasket() {
    this.basketService.addProduct(this.product);
  }

}
