import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgpwPage } from './forgpw.page';

const routes: Routes = [
  {
    path: '',
    component: ForgpwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgpwPageRoutingModule {}
