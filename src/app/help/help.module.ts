import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';

import { IconsModule } from '../icons/icons.module';
import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    HelpPageRoutingModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
