import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddmemberPage } from './addmember.page';

const routes: Routes = [
  {
    path: '',
    component: AddmemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddmemberPageRoutingModule {}
