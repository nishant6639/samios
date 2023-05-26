import { Component, OnInit, OnDestroy } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { ApiService } from '../../services/api.service';
import { CallService } from '../../services/call.service';
import { FirebaseService } from '../../services/firebase.service';
import { AlertController } from '@ionic/angular';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
declare let ConnectyCube;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
	userDets:any=[];
	calls:any = [];
	calls_final:any = [];
	countSet:any = 0;
	show:any = 0;
	date_events:any = [];
	selectedBookDate:any = "";
	bookingRequest:any = "";
  	constructor(private misc:MiscService,
  						public alertController: AlertController,
  						private api:ApiService,
  						private firebase:FirebaseService,
  						private calling:CallService,
  						// private localNotifications: LocalNotifications
  						) {
  	}

  	ngOnInit() {

  	}

  	unsorted(){
  		return 0;
  	}

  	ionViewWillEnter() {
  		this.firebase.initUserAccept(this.getBookings.bind(this));
  		this.show = 0;
  		this.calls = [];
  		this.calls_final = [];
  		this.selectedBookDate = "";
	  	this.userDets = this.misc.getUserDets();
	  	this.userDets.acceptance_rate = parseInt(this.userDets.acceptance_rate);
	  	this.userDets.job_success = parseInt(this.userDets.job_success);
	  	this.userDets.avail_rate = parseInt(this.userDets.avail_rate);
  		// this.show = 0;
  		// this.firebaseInit();
	  	this.misc.backExitSub();
	  	this.getBookings();
	}
	
	
	takeAction(event){
		if(event.action == 'done'){
			this.getBookings();
		}
	}

	getBookings(){
		this.api.getUpcomingCalls(1)
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

	acceptOrder(order_id, status){
		var data = {
			'order_id': order_id,
			'status' : status
		};

		this.misc.showLoader();
		this.api.acceptOrder(data)
		.then(resp => {
			var order_date = new Date((resp.data.order.date + " UTC").replace(/-/g, "/"));
			// const params = {
			// 	name: "My meeting",
			// 	// start_date: order_date,
			// 	// end_date: new Date(order_date.setHours(order_date.getHours() + 4)),
			// 	attendees: [
			// 		{ id: parseInt(resp.data.user.calling_id)},
			// 		{ id: parseInt(resp.data.provider.calling_id)}
			// 	],
			// 	record: false,
			// 	chat: true
			// };

			// ConnectyCube.meeting.create(params)
			// .then(meeting => {
			// 	let confRoomId = meeting._id;
			// 	var data1 = {
			// 		order_id: resp.data.order.id,
			// 		meeting_id: confRoomId
			// 	};
			// 	this.api.updateMeetingId(data1)
			// 	.then(resp => {

			// 	})
			// 	.catch(err => {

			// 	});
			// })
			// .catch(error => { });
			// if(status == 1){
			// 	// this.localNotifications.schedule({
			// 	//    	title: "Upcoming order.",
			// 	//    	text: 'Thank you for using Samanta. Your client booking begins in five minutes. Please be online and prepared for the appointment.',
			// 	//    	trigger: {at: new Date(new Date(order_date).getTime() - 300000)},
			// 	//    	led: 'FF0000',
			// 	//    	sound: null
			// 	// });
			// }
			var message = {
				'type': (status == 1)?'order_accepted':'order_declined',
				'order': resp.data.order
			};
			this.firebase.sendCallMsgsFn(resp.data.order.target_user_msg, JSON.stringify(message));
			this.bookingRequest = "";
			this.misc.hideLoader();
			this.getBookings();
		})
		.catch(err => {
			this.misc.hideLoader();
		});
	}

	// getSeconds(t2){
	// 	var t1 = new Date();
	// 	// console.log(t1+'======'+t2);
	// 	var dif = t2.getTime() - t1.getTime();
	// 	// console.log(dif);
	// 	if(dif < 0){
	// 		dif = 0;
	// 	}
	// 	var Seconds_from_T1_to_T2 = dif / 1000;
	// 	var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
	// 	// // console.log(Seconds_Between_Dates);
	// 	return Seconds_Between_Dates;
	// }

	diff_seconds(dt2, dt1) 
	{
		var diff =(dt2.getTime() - dt1.getTime()) / 1000;
		return Math.abs(Math.round(diff));
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
      this.misc.backExitUnsub();
    }
    ngOnDestroy(){
      // this.misc.backExitUnsub();
    }

}
