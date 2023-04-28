import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailPage } from './avail.page';

const routes: Routes = [
  {
    path: '',
    component: AvailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailPageRoutingModule {}
