import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconsModule } from '../../icons/icons.module';
import { DatepickModule } from '../../datepick/datepick.module';

import { TypePageRoutingModule } from './type-routing.module';

import { TypePage } from './type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    DatepickModule,
    TypePageRoutingModule
  ],
  declarations: [TypePage]
})
export class TypePageModule {}
