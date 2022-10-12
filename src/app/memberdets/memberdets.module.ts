import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberdetsPageRoutingModule } from './memberdets-routing.module';

import { IconsModule } from '../icons/icons.module';
import { MemberdetsPage } from './memberdets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    MemberdetsPageRoutingModule
  ],
  declarations: [MemberdetsPage]
})
export class MemberdetsPageModule {}
