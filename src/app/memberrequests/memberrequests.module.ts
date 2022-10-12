import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberrequestsPageRoutingModule } from './memberrequests-routing.module';

import { MemberrequestsPage } from './memberrequests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberrequestsPageRoutingModule
  ],
  declarations: [MemberrequestsPage]
})
export class MemberrequestsPageModule {}
