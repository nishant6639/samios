import { Component, OnInit, OnDestroy } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { CallService } from '../services/call.service';
import { FirebaseService } from '../services/firebase.service';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
	userDets:any;
	calls:any;
	calls_final:any = [];
	countSet:any = 0;
	show:any = 0;
	unavailabilities:any=[];
	selectedTab:any = 0;
	todayDate:any;
	orders:any;
	bookingRequest:any = "";
	unavailPop:any = 0;
	today:any = new Date();
	view: CalendarView = CalendarView.Month;
	selectedDate:any;
	selectedBookDate:any = "";
	date_events:any = [];
  CalendarView = CalendarView;
  	constructor(private misc:MiscService,
  						public alertController: AlertController,
  						private api:ApiService,
  						private firebase:FirebaseService,
  						private calling:CallService,
  						private localNotifications: LocalNotifications
  						) {
  	}

  	ngOnInit() {

  	}

  	ionViewWillEnter(){
  		this.firebase.initUserAccept(this.getBookings.bind(this));
  		this.show = 0;
  		this.calls = [];
  		this.calls_final = [];

  		// this.selectedDate = new Date();
		this.selectedDate = (new Date()).setHours(0,0,0,0);
		// console.log(this.selectedDate);
		this.todayDate = (new Date()).toISOString();
		this.userDets = this.misc.getUserDets();

  		// this.firebase.initProviderBooking(this.showAcceptToast.bind(this));
  		// this.firebaseInit();
	  	// this.misc.backExitSub();
	  	this.getBookings();

		this.getUnavailableData();
  	}

  	setToday(){
  		this.selectedDate = this.todayDate;
  	}

  	ionViewDidEnter() {
	}

	takeAction(event){
		if(event.action == 'done'){
			this.getBookings();
		}
	}
	unsorted(){
		return 0;
	}

	getBookings(){
		var data = {
			'date': this.selectedDate
		};
		this.api.getUpcomingCalls(0, data)
		.then(response => {
				var temp_calls = response.data.order;
				var final = [];
				for (var key of Object.keys(temp_calls)) {
					var this_key = (new Date((temp_calls[key]['date'] + " UTC").replace(/-/g, '/'))).setHours(0,0,0,0);
					temp_calls[key]['date'] = (new Date((temp_calls[key]['date']+" UTC").replace(/-/g, '/')));
					temp_calls[key]['start'] = new Date(temp_calls[key]['date']);
					if(final[this_key] == undefined){
						final[this_key] = [];
						final[this_key]['date'] = temp_calls[key]['date'];
						final[this_key]['start'] = temp_calls[key]['date'];
						final[this_key]['date_to_select'] = (temp_calls[key]['date']).setHours(0,0,0,0);
						if((temp_calls[key]['date']).setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)){
							final[this_key]['today'] = 1;
							temp_calls[key]['today'] = 1;
						}
						else{
							final[this_key]['today'] = 0;
							temp_calls[key]['today'] = 0;
						}
						final[this_key]['calls'] = [];
					}

					if((temp_calls[key]['date']).setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)){
						// final[this_key]['today'] = 1;
						temp_calls[key]['today'] = 1;
					}
					else{
						// final[this_key]['today'] = 0;
						temp_calls[key]['today'] = 0;
					}

					temp_calls[key]['sec'] = this.getTimeInS(temp_calls[key]['start']);

					if(temp_calls[key]['sec'] > 1800){
						temp_calls[key]['canc_allowed'] = 1;
					}
					else{
						temp_calls[key]['canc_allowed'] = 0;
					}

					// temp_calls[key]['date'] = (new Date((temp_calls[key]['date']+" UTC").replace(/-/g, '/')));
					(final[this_key]['calls']).push(temp_calls[key]);

				}
				for (var key of Object.keys(final)) {
					// // console.log(final[key]['calls'][0]);
					for(var key1 of Object.keys(final[key].calls)){
						if(final[key]['first'] == undefined){
							// if(final[key].calls[key1].passed == 0){
								final[key]['first'] = final[key]['calls'][key1];
							// }
						}
					}
				}

				var i = 0;
				for (var key of Object.keys(final)) {
					var mem = final[key];
				    delete final[key];
				    final[i] = mem;
				    (this.date_events).push(final[i]['date_to_select']);
				    i++;
				}
				// console.log(final);
				this.calls = final;
			this.show = 1;

		})
		.catch( err => {

		});
	}

	callUser(id, order_id){
		this.calling.call(id, order_id);
	}

	getTimeInS(call_date){
		var date = new Date(call_date);
		var new_date = new Date();
		var dif = date.getTime() - new_date.getTime();
		if(dif < 0){
			dif = 0;
		}
		var Seconds_from_T1_to_T2 = dif / 1000;
		var seconds = Math.abs(Seconds_from_T1_to_T2);
		return seconds;
	}

	showAcceptToast(order_id){
		var data = {
			'order_id': order_id
		};
		this.api.getOrderDetails(data)
		.then(resp => {
			this.bookingRequest = resp.data.order;
		})
		.catch(err => {

		});
	}

	acceptOrder(order_id, status){
		var data = {
			'order_id': order_id,
			'status' : status
		};
		this.misc.showLoader();
		this.api.acceptOrder(data)
		.then(resp => {
			var order_date = new Date((resp.data.order.date + " UTC").replace(/-/g, "/"));
			if(status == 1){
				this.localNotifications.schedule({
						title: "Upcoming order.",
				   	text: 'Thank you for using Samanta. Your client booking begins in five minutes. Please be online and prepared for the appointment.',
				   	trigger: {at: new Date(new Date(order_date).getTime() - 300000)},
				   	led: 'FF0000',
				   	sound: null
				});
			}
			var message = {
				'type': 'order_accepted',
				'order': resp.data.order
			};
			this.firebase.sendCallMsgsFn(resp.data.order.target_user, JSON.stringify(message));

			this.bookingRequest = "";
			this.misc.hideLoader();
			this.getBookings();
		})
		.catch(err => {

		});
	}

	getDayEvents(event){
		// console.log(event);
		this.selectedDate = (new Date(event.day.date)).setHours(0,0,0,0);
		// this.selectedDate = new Date(((new Date(event.day.date + " UTC")).setHours(0,0,0,0))).toISOString();
		// console.log(this.selectedDate);
	}


	checkToday(date){
		var today = new Date();
		var this_date = new Date(date);
		var d1 = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
		var d2 = this_date.getFullYear()+'/'+(this_date.getMonth()+1)+'/'+this_date.getDate();
		// // console.log(d1+'----'+d2);
		if(d1 == d2){
			// // console.log('true');
			return true;
		}
		// // console.log('false');
		return false;
	}


	diff_seconds(dt2, dt1) 
	{
		var diff =(dt2.getTime() - dt1.getTime()) / 1000;
		return Math.abs(Math.round(diff));
	}

	

	formatDate(date) {
	    var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) 
	        month = '0' + month;
	    if (day.length < 2) 
	        day = '0' + day;

	    return [year, month, day].join('-');
	}

	getUnavailableData(){
		this.api.getUnavailable()
		.then(response => {
			var temp_unavail = response.data.unavailable_list;
			for (var key of Object.keys(temp_unavail)) {
				temp_unavail[key]['unavailable_date'] = (new Date((temp_unavail[key]['unavailable_date'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['start_time'] = (new Date((temp_unavail[key]['start_time'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['end_time'] = (new Date((temp_unavail[key]['end_time'] + " UTC").replace(/-/g, '/'))).toISOString();
			}
			this.unavailabilities = temp_unavail;
			// this.misc.hideLoader();
			// this.misc.showToast('Marked unavailable succesfully');
		})
		.catch(err => {
			// this.misc.hideLoader();
			this.misc.handleError(err);
		});
	}

	addUnavailability(event){
		this.misc.showLoader();
		// console.log(event);
		// var data = event;
		var date = this.formatDate(event['date']);
		// var day = date.getDate(); //Date of the month: 2 in our example
		// var month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
		// var year = date.getFullYear() //Year: 2013

		var start_time = new Date(date+'T'+this.misc.getTimeTF(event['start_time']));
		var end_time = new Date(date+'T'+this.misc.getTimeTF(event['end_time']));

		var data = {
			'unavailable_date': event['date'],
	      	'start_time': start_time,
	      	'end_time': end_time
      	};
      	// console.log(data);
		this.api.addUnavailable(data)
		.then(response => {
			this.unavailPop = 0;
			this.selectedTab = 1;
			var temp_unavail = response.data.unavailable_list;
			for (var key of Object.keys(temp_unavail)) {
				temp_unavail[key]['unavailable_date'] = (new Date((temp_unavail[key]['unavailable_date'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['start_time'] = (new Date((temp_unavail[key]['start_time'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['end_time'] = (new Date((temp_unavail[key]['end_time'] + " UTC").replace(/-/g, '/'))).toISOString();
			}
			this.unavailabilities = temp_unavail;
			this.misc.hideLoader();
			this.misc.showToast('Marked unavailable succesfully');
		})
		.catch(err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		});
	}

	deleteUnavailability(id){
		// alert(id);
		this.misc.showLoader();
		var data = {
			'id': id
      	};

      	// console.log(data);
		
		this.api.deleteUnavailable(data)
		.then(response => {
			var temp_unavail = response.data.unavailable_list;
			for (var key of Object.keys(temp_unavail)) {
				temp_unavail[key]['unavailable_date'] = (new Date((temp_unavail[key]['unavailable_date'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['start_time'] = (new Date((temp_unavail[key]['start_time'] + " UTC").replace(/-/g, '/'))).toISOString();
				temp_unavail[key]['end_time'] = (new Date((temp_unavail[key]['end_time'] + " UTC").replace(/-/g, '/'))).toISOString();
			}
			this.unavailabilities = temp_unavail;
			this.misc.hideLoader();
			this.misc.showToast('Deleted succesfully');
		})
		.catch(err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		});
	}


	async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'samanta-alert-block',
      header: 'Cancel booking?',
      message: 'Are you sure you want to cancel?',
      buttons: [
        {
          text: 'Confirm',
          role: 'cancel',
          handler: (blah) => {
            // // console.log('Confirm Cancel: blah' + id);
            this.cancelOrder(id);
          }
        }, {
          text: 'Return',
          cssClass: 'secondary',
          handler: () => {
            // console.log('No');
          }
        }
      ]
    });

    await alert.present();
  }

	cancelOrder(order_id){
		var data = {
			cancel_type: -2,
			order_id: order_id
		};
		this.api.cancelOrder(data)
		.then(resp => {
			this.misc.showToast('Order Cancelled succesfully');
			this.getBookings();
			// this.router.navigate(['/summary/'+this.orderId]);
		})
		.catch(err => {
			this.misc.handleError(err);
		});
	}

	doRefresh(event) {
	    // console.log('Begin async operation');
	    this.ionViewWillEnter();
	    event.target.disabled = true;
	    event.target.complete();
	    setTimeout(() => {
	      event.target.disabled = false;
	    }, 1000);
	  }

	ionViewWillLeave(){
      // this.misc.backExitUnsub();
    }
    ngOnDestroy(){
    //   this.misc.backExitUnsub();
    }

}
