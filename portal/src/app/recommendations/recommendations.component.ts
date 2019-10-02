import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { RecommendationService } from '../recommendation.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  products: Product[];

  constructor(
    private recommendationService: RecommendationService
  ) { }

  ngOnInit() {
    this.products = this.recommendationService.products;
  }

}
