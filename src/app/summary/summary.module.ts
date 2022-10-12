import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconsModule } from '../icons/icons.module';
import { SummaryPageRoutingModule } from './summary-routing.module';

import { SummaryPage } from './summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    SummaryPageRoutingModule
  ],
  declarations: [SummaryPage]
})
export class SummaryPageModule {}
