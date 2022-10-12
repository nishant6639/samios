import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ApiService } from '../../services/api.service';
import { MiscService } from '../../services/misc.service';
@Component({
  selector: 'ion-datepick',
  templateUrl: './datepick.component.html',
  styleUrls: ['./datepick.component.scss'],
})
export class DatepickComponent implements OnInit {

	@Input() type:any;
	@Output() dateSet = new EventEmitter<any>();
	@Output() close = new EventEmitter<any>();
	valChange:any = {};
	days:any = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];
	hours:any = new Array(24);
  	minutes:any = new Array(60);
	apm:any = ['AM', 'PM'];
	finalVal:any;
	date:any = new Date();
	plans:any;
	show:any = 0;
	constructor(private datePicker: DatePicker, private api: ApiService, private misc: MiscService) {
		for(var i = 0; i < this.hours.length; i++){
			if(i < 9){
				this.hours[i] = "0"+(i);
			}
			else{
				this.hours[i] = (i);
			}
		}
		for(var i = 0; i < this.minutes.length; i++){
			if(i < 10){
				this.minutes[i] = "0"+i;
			}
			else{
				this.minutes[i] = i;
			}
		}

		this.valChange = {
			'day': 0,
			'hour1': '00',
			'minute1': '00',
			'apm1': 0,
			'hour2': '00',
			'minute2': '00',
			'apm2': 0,
			'for': 1,
			'date': this.date
		};
	}

	ngOnInit() {
		this.api.getPlans()
        .then( response => {
            // // console.log(response);
            this.plans = response.data.plans;
            this.show = 1;
        })
        .catch(err => {
            this.misc.handleError(err);
        })
	}

	scrollThis(type, event){
		var scrollPos = event.target.scrollTop;
		var targ = event.target;
		var children = event.target.children;
		var itemPos = (Math.floor((scrollPos+20) / 40));
		for (var i = 0; i < children.length; i++) {
			  children[i].className = "item";
		  }
		children[itemPos].className = "item active";
		// // console.log(event);
		var this_val = children[itemPos].dataset['selval'];
		this.valChange[type] = this_val;
		// // console.log(this.valChange);
		// if(this.valChange['hour1'] && this.valChange['minute1'] && this.valChange['apm1'] && this.valChange['hour2'] && this.valChange['minute2'] && this.valChange['apm2']){
			this.formatTime();
		// }
		// else{
			// this.finalVal= [];
		// }
	}

	formatTime(){
	
		if(this.type == 1){
			var time1 = this.valChange['hour1']+":"+this.valChange['minute1']+":00";
			var time2 = this.valChange['hour2']+":"+this.valChange['minute2']+":00";
			this.finalVal = {
				// 'day': this.valChange['day'],
				'start_time': time1,
				'end_time': time2
			};
		}
		else if(this.type == 3){
			var time1 = this.valChange['hour1']+":"+this.valChange['minute1']+":00";
			var time2 = this.valChange['hour2']+":"+this.valChange['minute2']+":00";
			this.finalVal = {
				'date': this.date,
				'start_time': time1,
				'end_time': time2
			};
		}
		else{
			var time1 = this.valChange['hour1']+":"+this.valChange['minute1']+":00";
			var plan_time;
			for (var key of Object.keys(this.plans)) {
				if(this.plans[key].id == this.valChange['for']){
					plan_time = this.plans[key].time_to;
				}
			}
			var time_enc = this.misc.getTimeTF(time1);
			var date_set:any = new Date(this.date);
			var time_arr = time_enc.split(":");
			date_set.setHours(time_arr[0], time_arr[1], time_arr[2]);

			this.finalVal = {
				'date': date_set,
				'start_time': time1,
				'for': this.valChange['for'],
				'time': plan_time
			};
		}
	
		// console.log(this.finalVal);
	
	}

	setDate(){
		this.dateSet.emit(this.finalVal);
	}
	closeDatePicker(){
		this.close.emit(1);
	}

	selectDate(){
		this.datePicker.show({
		  	date: new Date(),
		  	mode: 'date',
		  	androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
		}).then(date => {
			this.date = date;
			this.formatTime();
		})
		.catch(err => {
			// // console.log('Error occurred while getting date: ', err)
		});
	}

}