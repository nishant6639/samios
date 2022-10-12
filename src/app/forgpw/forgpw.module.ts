import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgpwPageRoutingModule } from './forgpw-routing.module';

import { ForgpwPage } from './forgpw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgpwPageRoutingModule
  ],
  declarations: [ForgpwPage]
})
export class ForgpwPageModule {}
