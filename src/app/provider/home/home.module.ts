import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeaderModule } from '../../header/header.module';

import { IconsModule } from '../../icons/icons.module';
import { CountdownModule } from 'ngx-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
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
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
