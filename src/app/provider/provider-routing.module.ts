import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderPage } from './provider.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'select-language',
    loadChildren: () => import('./select-language/select-language.module').then( m => m.SelectLanguagePageModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then( m => m.BookingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderPageRoutingModule {}
