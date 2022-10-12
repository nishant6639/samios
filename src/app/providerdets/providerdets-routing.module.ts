import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderdetsPage } from './providerdets.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderdetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderdetsPageRoutingModule {}
