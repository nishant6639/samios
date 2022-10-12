import { Component } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { CallService } from '../services/call.service';
import { FirebaseService } from '../services/firebase.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	popup:any = {
		'time': 0,
		'filter': 0
	};
	filData:any = {};
	languages:any;
	translate_from:any = 0;
	translate_to:any = 0;
	providers:any = [];
	providerLoading:any = 1;
	userDets:any = [];
	showDate:any = "";
	calls:any = [];
	calls_final:any = [];
	show:any = 0;
	fav_loader_id:any = 0;
	fav_list:any = [];
	selectedBookDate:any = "";
	selectedDate:any = "";
	rate_temp:any = "";
	date_events:any = [];
  constructor(private misc:MiscService,
  						private api:ApiService,
  						private firebase:FirebaseService,
  						private calling:CallService,
  						public alertController: AlertController
  						) {
  }

  	ionViewWillEnter(){
  		this.firebase.initUserAccept(this.getBookings.bind(this));
		this.showDate = "";
		this.calls = [];
		this.calls_final = [];
		this.fav_loader_id = 0;
  		this.userDets = this.misc.getUserDets();
  		this.show = 0;
		this.filData = {};
		this.fav_list = [];
		this.providers = [];
		this.providerLoading = 1;
	  	this.getLanguages();
			this.getBookings();
	}

	ionViewDidEnter(){
  		this.misc.backExitSub();
	}


	takeAction(event){
		// console.log(event);
		if(event.action == 'done'){
			this.getBookings();

		}
		if(event.action == 'start'){
			this.getProviders();
		}
	}

	getLanguages(){
		this.api.getLanguages()
		.then(response =>{
			this.languages = response.data.languages;
			var lang1 = window.localStorage.getItem('language1');
			var lang2 = window.localStorage.getItem('language2');
			if(lang1){
				this.filData['translate_from'] = localStorage.getItem('language1');
			}
			else{
				this.filData['translate_from'] = this.languages[0].id;
			}

			if(lang2){
				this.filData['translate_to'] = localStorage.getItem('language2');
			}
			else{
				this.filData['translate_to'] = this.languages[1].id;
			}

			this.getProviders();
		})
		.catch(err => {

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
			this.getProviders();
			// this.router.navigate(['/summary/'+this.orderId]);
		})
		.catch(err => {
			this.misc.handleError(err);
		});
	}

	// // console.log(formatAMPM(new Date));

	getProviders(){
		var data = this.filData;
		if(data['day'] == null){
			var d = new Date();
			var n = d.getDay();
			data['day'] = n;
			data['start_time'] = this.formatAMPM(new Date());
		}
		localStorage.setItem('language1', this.filData['translate_from']);
		localStorage.setItem('language2', this.filData['translate_to']);
		this.api.getProviders(data)
		.then(response =>{
			this.providerLoading = 0;
			// console.log(response);
			this.providers = response.data.users;
			this.providerFavUpd();
		})
		.catch(err => {

		});
	}

	providerFavUpd(){
		if(!(this.userDets.fav_list == null)){
  			this.fav_list = (this.userDets.fav_list).split(',');
  			// console.log(this.fav_list);
		}
		for (var key of Object.keys(this.providers)) {
			this.providers[key].fav = (this.fav_list).includes((this.providers[key].id).toString());
			// console.log('Adv'+this.providers[key].fav);
		}
	}



	formatAMPM(date){
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = ':00';
	  // hours = hours % 12;
	  // hours = hours ? hours : 12; // the hour '0' should be '12'
	  // minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ampm;
	  return strTime;
	}

	clearFilter(){
		delete this.filData['exp_level'];
		delete this.filData['rating_low'];
		delete this.filData['rating_high'];
		delete this.filData['acceptance_rate'];
		this.rate_temp = "";
		this.getProviders();
	}

	checkTime(from_time, date, mins){
		var start_time_of_order = new Date(date+' '+from_time+' UTC');
		var end_time_of_order = new Date(start_time_of_order.getTime() + mins*60000);
		// console.log(start_time_of_order+'-----'+end_time_of_order);

		var start_time_of_request = new Date(this.filData['date']);
		var end_time_of_request = new Date(start_time_of_request.getTime() + this.filData['time']*60000);


		if((start_time_of_request > start_time_of_order) && (start_time_of_request < end_time_of_order)){
			return 0;
		}

		if((end_time_of_request > start_time_of_order) && (end_time_of_request < end_time_of_order)){
			return 0;
		}

	}

	setRating(rating_low,rating_high){
		this.filData['rating_low'] = rating_low;
		this.filData['rating_high'] = rating_high;
	}

	setImmediately(){
		this.showDate = "";
		this.popup.time = 0;
		delete this.filData['date'];
		delete this.filData['start_time'];
		delete this.filData['for'];
		delete this.filData['time'];
		delete this.filData['day'];

		this.getProviders();
	}

	filterByDate(event){
		// console.log(event);
		this.showDate = event;
		this.popup.time = 0;
		this.filData['date'] = event.date;
		this.filData['start_time'] = event.start_time;
		this.filData['for'] = event.for;
		this.filData['time'] = event.time;
		this.filData['day'] = new Date(event.date).getDay();
		
		this.getProviders();
	}

	filterProvider(){
		var check_provider_stat;
		for (var key of Object.keys(this.providers)) {
			this.providers[key]['enable'] = 1;
			for (var key1 of Object.keys(this.providers[key].orders)) {
				check_provider_stat = this.checkTime(this.providers[key].orders[key1].from_time, this.providers[key].orders[key1].date, this.providers[key].orders[key1].time_to);
				if(check_provider_stat == 0){
					this.providers[key]['enable'] = 0;
				}
			}
		}
		// console.log(this.providers);
	}

	getBookings(){
		this.api.getUpcomingCalls(2)
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

	// acceptOrder(order_id, status){
	// 	var data = {
	// 		'order_id': order_id,
	// 		'status' : status
	// 	};
	// 	this.api.acceptOrder(data)
	// 	.then(resp => {
	// 		this.bookingRequest = "";
	// 		this.getBookings();
	// 	})
	// 	.catch(err => {

	// 	});
	// }

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

	setFav(id, name, type){
		var data = {
			'id': id,
			'type': type
		};

		this.fav_loader_id = id;

		this.api.setFav(data)
		.then( resp => {
			this.fav_loader_id = 0;
			if(type == 'add'){
				this.misc.showToast(name+' added to favourite');
			}
			else{
				this.misc.showToast(name+' removed from favourite');
			}
			// console.log(resp);
			this.userDets = resp.data.user;
			this.providerFavUpd();
		})
		.catch(err => {
			this.fav_loader_id = 0;
			// console.log(err);
		})
	}

	acceptOrder(id, type){

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
    	//   this.misc.backExitUnsub();
    }

}
