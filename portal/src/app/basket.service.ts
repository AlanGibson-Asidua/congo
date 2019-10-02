import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { BasketItem } from './basket-item';
import { Product } from './product';
import { ProductService } from './product.service';
import { RecommendationService } from './recommendation.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  items: BasketItem[];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private recommendationService: RecommendationService
  ) {
    this.items = [];
    this.loadBasketItems();
  }

  addProduct(product: Product) {
    this.http
      .post('http://localhost:5002/basket/items', { product_id: product.id })
      .subscribe((result: any) => {
        
        let item = this.items.find((x) => {
          return x.id == result.id;
        });

        if (item) {
          item.quantity = result.quantity;
        } else {
          this.productService
            .getProduct(result.product_id)
            .subscribe(p => { 
              this.items.push(new BasketItem(result.id, result.quantity, p));
              this.recommendationService.getRecommendedProducts();
            });
        }
      });
  }

  removeBasketItem(id: number) {
    this.http
      .delete(`http://localhost:5002/basket/items/${id}`)
      .subscribe(x => {
        this.items.splice(this.items.findIndex(item => item.id === id), 1)
        this.recommendationService.getRecommendedProducts();
      });
  }

  emptyBasket(localOnly: boolean = false) {
    if (localOnly) {
      this.items.length = 0;
      this.recommendationService.getRecommendedProducts();
    } else {
      this.items.forEach(i => this.removeBasketItem(i.id));
    }
  }

  submit() : Observable<BasketItem[]> {
    return this.http
      .post<BasketItem[]>('http://localhost:5002/basket/submit', '');
  }


  private loadBasketItems() {
    this.items.length = 0;
    this.http
      .get<any[]>('http://localhost:5002/basket/items')
      .subscribe(results => {
        results.forEach(result => {
          this.productService
            .getProduct(result.product_id)
            .subscribe(p => { 
              this.items.push(new BasketItem(result.id, result.quantity, p));
            });
        });
      });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with the error data
    return throwError(error.error);
  };
}
