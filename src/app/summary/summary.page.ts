import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { CallService } from '../services/call.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
@Component({
	selector: 'app-summary',
	templateUrl: './summary.page.html',
	styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
	show:any = 0;
	orderId:any;
	summary:any = [];
	negative_credit:any = 0;
	starRate:any = 0;
	review_text:any = "";
	callRef: AngularFireObject<any>;
	userDets:any;
	dispute_reason:any;
	showDispute:any = 0;
	plans:any = [];
	callLog:any = [];
	constructor(private router:Router,
		private db: AngularFireDatabase,
		private route: ActivatedRoute,
		private misc:MiscService,
		private calling:CallService,
		private api:ApiService
	) { }

	ngOnInit() {
	}

	ionViewWillEnter(){
		this.dispute_reason = "";
		this.show = 0;
		this.callLog = [];
		this.userDets = this.misc.getUserDets();
		// console.log(this.userDets);
		this.route.params.subscribe(params => {
				this.orderId = params['id'];
				this.getOrderSummary();
		});
	}

	getOrderSummary(){
		this.api.getCallSummary(this.orderId)
		.then(response => {
		this.summary = response.data.order;
		this.summary['total_time'] = parseInt(this.summary.plan_time) + this.summary.extension_min;
		this.negative_credit = response.data.negative_credit_balance;
		// if( ((new Date()).getTime()) > (new Date(this.summary.to_time+" UTC").getTime())){
		// 	this.summary['passed'] = 1;
		// }
		// else{
		// 	this.summary['passed'] = 0;
		// }
		this.summary['date'] = (new Date((this.summary['date']+" UTC").replace(/-/g, '/')));
		this.summary['sec'] = this.getTimeInS(this.summary['date']);
		if(!(this.summary['call_log'] == null)){
			this.callLog = JSON.parse(this.summary['call_log']);
			this.callLog.reverse();
		}
		else{
			this.callLog = [];
		}
		// console.log(this.summary);
		this.api.getPlans()
        .then( response => {
            this.plans = response.data.plans;
        })
        .catch(err => {
            this.misc.handleError(err);
        });
        // this.getCallLog();
		this.show = 1;
	})
	.catch( err => {
		this.misc.hideLoader();
		this.misc.handleError(err);
	});
	}

	callUser(id, order_id){
	    this.calling.call(id, order_id);
	    // setTimeout( () => {
	    // 	if(this.userDets.user_type == 3){
		//     	this.router.navigate(['/provider/home']);
	    // 	}
	    // 	else{
		//     	this.router.navigate(['/home']);
	    // 	}
	    // }, 3000);
	    // this.bookData = [];
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

	setRate(val){
		this.starRate = val;
	}


	submitReview(){
		if(this.starRate == 0){
			this.misc.showToast('Select star rating');
			return false;
		}

		// if(this.review_text == ""){
			// this.misc.showToast('Enter Review');
			// return false;
		// }

		this.misc.showLoader();
		if(this.summary.user_id == this.userDets.id){
			var reviewer_id = this.summary.user_id;
			var review_for_id = this.summary.service_provider_id;
		}
		else{
			var reviewer_id = this.summary.service_provider_id;
			var review_for_id = this.summary.user_id;
		}
		var data = {
			'language_from': this.summary.language_from,
			'language_to': this.summary.language_to,
			'rating': this.starRate,
			'review_text': this.review_text,
			'reviewer_id': reviewer_id,
			'review_for': review_for_id
		};
		this.api.addReview(this.orderId, data)
		.then(resp => {
			this.misc.hideLoader();
			this.misc.showToast('Review submitted succesfully');
			this.router.navigate(['/bookings']);
		})
		.catch(err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		})
		// console.log(data);
	}

	markComplete(type){
		this.misc.showLoader();
		var data1 = {
			order_id: this.orderId,
			type: type,
			dispute_reason: this.dispute_reason
		};
		this.api.updateOrder(data1)
		.then(resp => {
			this.misc.hideLoader();
			if(type == 1){
				this.misc.showToast('Order marked Completed succesfully');
			}
			else{
				this.misc.showToast('Order marked disputed succesfully');
			}

			this.getOrderSummary();
			
			// this.router.navigate(['/summary/'+this.orderId]);
			
		})
		.catch(err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		});
	}

	getCallLog(){
		// this.callRef = this.db.object('call'+this.summary.id);
		// // // console.log(this.callRef);
		// this.callRef.snapshotChanges().subscribe(action => {
		// 	// console.log(action.payload.val());
		// 	if(!(action.payload.val() == null)){
		// 		this.callLog = action.payload.val();
		// 		if(!(this.callLog == "")){
		// 			this.callLog = JSON.parse(this.callLog);
		// 		}
		// 		else{
		// 			this.callLog = [];
		// 		}
		// 	}
		// });
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

}
