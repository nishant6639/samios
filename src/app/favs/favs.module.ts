import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IconsModule } from '../icons/icons.module';

import { FavsPageRoutingModule } from './favs-routing.module';

import { FavsPage } from './favs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    FavsPageRoutingModule
  ],
  declarations: [FavsPage]
})
export class FavsPageModule {}
