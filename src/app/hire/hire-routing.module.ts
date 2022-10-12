import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HirePage } from './hire.page';

const routes: Routes = [
  {
    path: '',
    component: HirePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HirePageRoutingModule {}
