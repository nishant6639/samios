import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  },
  {
    path: 'type/:type',
    loadChildren: () => import('./type/type.module').then( m => m.TypePageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'dp',
    loadChildren: () => import('./dp/dp.module').then( m => m.DpPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
