import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderModule } from '../header/header.module';
import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { IconsModule } from '../icons/icons.module';
import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
