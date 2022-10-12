import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconsModule } from '../../icons/icons.module';
import { SelectLanguagePageRoutingModule } from './select-language-routing.module';

import { SelectLanguagePage } from './select-language.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    SelectLanguagePageRoutingModule
  ],
  declarations: [SelectLanguagePage]
})
export class SelectLanguagePageModule {}
