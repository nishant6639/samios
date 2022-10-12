import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { DatepickModule } from '../datepick/datepick.module';
import { HeaderModule } from '../header/header.module';
import { IconsModule } from '../icons/icons.module';
import { CountdownModule } from 'ngx-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatepickModule,
    HeaderModule,
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
    IconsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
