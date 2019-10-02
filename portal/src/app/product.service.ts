import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts() : Observable<Product[]> {
    return this.http
      .get('http://localhost:5001/products')
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          return new Product(
            item.id,
            item.product_name,
            item.category,
            item.brand,
            item.price,
            item.description);
        }))
      );
  }

  getProduct(id: number) : Observable<Product> {
    return this.http
      .get(`http://localhost:5001/products/${id}`)
      .pipe(
        map((item: any) => {
          return new Product(
            item.id,
            item.product_name,
            item.category,
            item.brand,
            item.price,
            item.description);
        })
      )
  }
}
