import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberdetsPage } from './memberdets.page';

const routes: Routes = [
  {
    path: '',
    component: MemberdetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberdetsPageRoutingModule {}
