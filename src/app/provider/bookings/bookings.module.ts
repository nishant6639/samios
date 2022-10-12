import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../header/header.module';

import { IconsModule } from '../../icons/icons.module';

import { BookingsPageRoutingModule } from './bookings-routing.module';

import { BookingsPage } from './bookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    BookingsPageRoutingModule
  ],
  declarations: [BookingsPage]
})
export class BookingsPageModule {}
