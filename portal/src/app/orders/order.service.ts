import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrders() : Observable<Order[]> {
    return this.http
      .get<Order[]>('http://localhost:5004/orders')
      .pipe(
        map((result: Order[]) => { return result; })
      );
  }

  getOrder(id: number) : Observable<Order> {
    return this.http
      .get<Order>(`http://localhost:5004/orders/${id}`)
      .pipe(
        map((result: Order) => { return result; })
      );
  }
}
