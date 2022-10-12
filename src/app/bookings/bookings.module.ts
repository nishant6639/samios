import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeaderModule } from '../header/header.module';
import { BookingsPageRoutingModule } from './bookings-routing.module';
import { DatepickModule } from '../datepick/datepick.module';

import { CountdownModule } from 'ngx-countdown';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BookingsPage } from './bookings.page';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { IconsModule } from '../icons/icons.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    IconsModule,
    DatepickModule,
    BookingsPageRoutingModule,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [BookingsPage]
})
export class BookingsPageModule {}
