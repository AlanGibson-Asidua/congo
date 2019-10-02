import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  products: Product[];

  constructor(
    private http: HttpClient
  ) { 
    this.products = new Array<Product>();
    this.getRecommendedProducts();
  }

  getRecommendedProducts() {
    this.products.length = 0;
    this.http
      .get<any>('http://localhost:5003/recommendations')
      .subscribe(results => {
        results.forEach(result => this.products.push(
          new Product(
            result.id,
            result.product_name,
            result.category,
            result.brand,
            result.price,
            result.description
          )
        ));
      });
  }
}
