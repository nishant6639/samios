import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';

import { IconsModule } from '../icons/icons.module';
import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    FaqPageRoutingModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
