import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';

import { IconsModule } from '../icons/icons.module';
import { WalletPageRoutingModule } from './wallet-routing.module';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { WalletPage } from './wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
      NgxTippyModule,
    WalletPageRoutingModule
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
