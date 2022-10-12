import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersPageRoutingModule } from './members-routing.module';

import { IconsModule } from '../icons/icons.module';
import { MembersPage } from './members.page';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    LongPressModule,
    MembersPageRoutingModule
  ],
  declarations: [MembersPage]
})
export class MembersPageModule {}
