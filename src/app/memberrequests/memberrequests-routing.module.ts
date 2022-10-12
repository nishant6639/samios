import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberrequestsPage } from './memberrequests.page';

const routes: Routes = [
  {
    path: '',
    component: MemberrequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberrequestsPageRoutingModule {}
