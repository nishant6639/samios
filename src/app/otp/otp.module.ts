import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CountdownModule } from 'ngx-countdown';
import { IonicModule } from '@ionic/angular';

import { IconsModule } from '../icons/icons.module';
import { OtpPageRoutingModule } from './otp-routing.module';

import { OtpPage } from './otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    CountdownModule,
    OtpPageRoutingModule
  ],
  declarations: [OtpPage]
})
export class OtpPageModule {}
