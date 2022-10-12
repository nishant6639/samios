import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';

import { NotificationPageRoutingModule } from './notification-routing.module';

import { IconsModule } from '../icons/icons.module';
import { NotificationPage } from './notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    NotificationPageRoutingModule
  ],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
