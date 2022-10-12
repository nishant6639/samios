import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownModule } from 'ngx-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HirePageRoutingModule } from './hire-routing.module';

import { IconsModule } from '../icons/icons.module';
import { HirePage } from './hire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
	NgCircleProgressModule.forRoot({
      	// set defaults here
      	radius: 100,
      	outerStrokeWidth: 16,
      	innerStrokeWidth: 8,
      	outerStrokeColor: "#78C000",
      	innerStrokeColor: "#C7E596",
      	animationDuration: 300
  	}),
  	CountdownModule,
    HirePageRoutingModule
  ],
  declarations: [HirePage]
})
export class HirePageModule {}
