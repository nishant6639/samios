import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DatepickModule } from '../datepick/datepick.module';
import { IconsModule } from '../icons/icons.module';

import { AvailPageRoutingModule } from './avail-routing.module';

import { AvailPage } from './avail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    DatepickModule,
    AvailPageRoutingModule
  ],
  declarations: [AvailPage]
})
export class AvailPageModule {}
