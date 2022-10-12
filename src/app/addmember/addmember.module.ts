import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddmemberPageRoutingModule } from './addmember-routing.module';

import { IconsModule } from '../icons/icons.module';
import { AddmemberPage } from './addmember.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    AddmemberPageRoutingModule
  ],
  declarations: [AddmemberPage]
})
export class AddmemberPageModule {}
