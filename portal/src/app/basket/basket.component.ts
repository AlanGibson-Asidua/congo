import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BasketItem } from '../basket-item';
import { BasketService } from '../basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  items: BasketItem[];

  constructor(
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit() {
    this.items = this.basketService.items;
  }

  total() {
    return this.items.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);
  }

  removeBasketItem(id: number) {
    this.basketService.removeBasketItem(id);
  }

  emptyBasket() {
    this.basketService.emptyBasket();
  }

  buyNow() {
    const itemsToSend = this.items.map(
      x => ({ 
        product_id: x.product.id, 
        quantity: x.quantity 
      })
    )
    
    this.basketService
      .submit()
      .subscribe((result: BasketItem[]) => {
        this.basketService.emptyBasket(true);
        this.router.navigate(['orders']);
      });
  }

}
