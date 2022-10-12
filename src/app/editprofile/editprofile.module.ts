import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DatepickModule } from '../datepick/datepick.module';

import { IconsModule } from '../icons/icons.module';
import { EditprofilePageRoutingModule } from './editprofile-routing.module';

import { EditprofilePage } from './editprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    DatepickModule,
    EditprofilePageRoutingModule
  ],
  declarations: [EditprofilePage]
})
export class EditprofilePageModule {}
