import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickComponent } from './datepick/datepick.component';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  	declarations: [
  		DatepickComponent
	],
  	imports: [
    	CommonModule,
    	IconsModule
  	],
  	exports: [
  		DatepickComponent
  	]
})
export class DatepickModule { }