import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../order';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent implements OnInit {

  @Input() order: Order;

  constructor() { }

  ngOnInit() {
  }

}
