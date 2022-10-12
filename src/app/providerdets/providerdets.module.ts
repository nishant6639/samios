import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DatepickModule } from '../datepick/datepick.module';

import { IconsModule } from '../icons/icons.module';
import { ProviderdetsPageRoutingModule } from './providerdets-routing.module';

import { ProviderdetsPage } from './providerdets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatepickModule,
    IconsModule,
    ProviderdetsPageRoutingModule
  ],
  declarations: [ProviderdetsPage]
})
export class ProviderdetsPageModule {}
