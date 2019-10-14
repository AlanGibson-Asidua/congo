import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueComponent } from './catalogue/catalogue.component';

import { loadScript } from './external-loader';


const routes: Routes = [

  { 
    path: '', 
    component: CatalogueComponent 
  },

  { 
    path: 'orders', 
    loadChildren: loadScript(
      'http://localhost:8081/orders-orders-module.js', 
      'orders', 
      'OrdersModule'
    ) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
