import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DpPage } from './dp.page';

const routes: Routes = [
  {
    path: '',
    component: DpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DpPageRoutingModule {}
