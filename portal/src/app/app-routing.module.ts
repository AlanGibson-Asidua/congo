import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueComponent } from './catalogue/catalogue.component';

const routes: Routes = [
  { path: '', component: CatalogueComponent },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
