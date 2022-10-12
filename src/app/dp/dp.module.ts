import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DpPageRoutingModule } from './dp-routing.module';

import { IconsModule } from '../icons/icons.module';
import { DpPage } from './dp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    DpPageRoutingModule
  ],
  declarations: [DpPage]
})
export class DpPageModule {}
