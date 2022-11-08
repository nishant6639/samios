import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { Stripe } from '@ionic-native/stripe/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.page.html',
	styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

		userDets:any;
		cardDetsPop:any = 0;
		cardModel:any = {};
		reqModel:any = {};
		showCardFields:any = 0;
		amount:any = 0;
		trans:any;
		walletData:any;
		show:any = 0;
		infoPopOpen:any = 0;
		account:any = [];
		offset:any = 0;
		showLoadMore:any = 0;
		showMoreLoad:any = 0;
		constructor(private misc:MiscService,
			private api:ApiService,
			private stripe: Stripe,
			private iab: InAppBrowser,
    		public alertController: AlertController) {
			
		}

		ngOnInit() {
			
		}

		ionViewWillEnter(){
			this.userDets = this.misc.getUserDets();
			this.show = 0;
			this.cardDetsPop = 0;
			this.cardModel = {};
			this.reqModel = {};
			this.showCardFields = 0;
			this.offset = 0;
			this.getWalletTransactions();
		}


		getWalletTransactions(){
			this.api.getWalletTransactions()
			.then(response =>{
				this.trans = response.data.wallet_transactions;
				if(response.data.total_trans > 10){
					this.showLoadMore = 1;
				}
				else{
					this.showLoadMore = 0;
				}
				// for (var key of Object.keys(this.trans)) {
			        // this.trans[key]['created_at'] = (new Date((this.trans[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
		      	// }
				this.walletData = response.data;
				if(this.userDets.user_type == 3){
					this.account = response.data.account;
				}
				this.userDets = response.data.user;
				this.show = 1;
			})
			.catch(err => {

			});
		}

		loadMoreTransaction(){
			this.showMoreLoad = 1;
			this.offset++;

			var data = {
				'offset': this.offset
			};

			this.api.loadMoreTransaction(data)
			.then(response =>{
				this.trans = (this.trans).concat(response.data.wallet_transactions);
				// console.log(this.trans);
				this.showMoreLoad = 0;
				var total_trans = response.data.total_trans;

				if(total_trans > ((this.offset + 1) * 10)){
					this.showLoadMore = 1;
				}
				else{
					this.showLoadMore = 0;
				}
				// array1.concat(array2)
			})
			.catch(err => {
				this.showMoreLoad = 0;
			});

		}

		withdrawPayment(){
			this.misc.showLoader();
			var data = this.cardModel;
			// this.payMsg = "Receiving Payment";
			this.api.withdrawPayment(data)
			.then(resp => {
				// // console.log(resp);
				// if(resp.data.response.transaction_id){
					this.userDets = resp.data.user;
					this.getWalletTransactions();
					this.misc.hideLoader();

					this.cardModel = {};
					alert('Withdraw request succesfully created.');
					// this.payMsg = "Payment Successful. Updating Favr Balance.";
					// this.getUserDetails();
					this.getWalletTransactions();
					// setTimeout(()=>{
						// this.payPopOpen = 0;
					// }, 2000);
				// }
				// else{
					// this.payMsg = "Payment Failed. Please Try again.";
					// alert('Failed');
					// setTimeout(()=>{
						// this.payPopOpen = 0;
					// }, 2000);
				// }
			})
			.catch(err => {
				this.misc.hideLoader();
				this.misc.handleError(err);
				// console.log(err);
			});
		}

		async initPayment(){
			const alert = await this.alertController.create({
		      cssClass: 'samanta-alert-block',
		      header: 'Confirm money addition?',
		      message: '<p class="text-center">Are you sure you want to add money? Press yes to proceed or return to cancel?</p>',
		      buttons: [
		        {
		          text: 'Yes',
		          handler: (blah) => {
		            // // console.log('Confirm Cancel: blah' + id);
		            this.initPaymentFun();
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

		initPaymentFun(){
			this.misc.showLoader();
			// this.payPopOpen = 1;
			// this.payMsg = "Initiating Payment";
			this.stripe.setPublishableKey('pk_live_51IDq61HtHgRcIAGG2rH3BwgDp7JQFgaWrroRgd7Mr02Ncno1S1tzMIWYFQL6NyQjjk4fNKAbWrXyJRm0gKS2Cc9L00PCMmDyLs');
			let card = this.cardModel;

			this.stripe.createCardToken(card)
			.then(token => {

					// console.log(token.id);
					var data = {
						stripeToken: token.id,
						amount: this.amount
					};
					// this.payMsg = "Receiving Payment";
					this.api.doPayment(data)
					.then(resp => {
						// // console.log(resp);
						if(resp.data.response.transaction_id){
							this.misc.hideLoader();
							this.cardModel = {};
							this.misc.showToast('Added Credit');
							this.getWalletTransactions();
							// this.payMsg = "Payment Successful. Updating Favr Balance.";
							// this.getUserDetails();
							// this.getFavrTransacList();
							// setTimeout(()=>{
								// this.payPopOpen = 0;
							// }, 2000);
						}
						else{
							// this.payMsg = "";
							this.misc.showToast('Payment Failed. Please Try again.');
						}
					})
					.catch(err => {
						// console.log(err);
						this.misc.hideLoader();
					});
			})
			.catch(error => {
				this.misc.hideLoader();
			})
		}

		requestBalance(){
			this.misc.showLoader();
			var data = {
				'amount': this.reqModel['amount']
			};

			this.api.doPayment(data)
			.then(resp => {
				this.misc.hideLoader();
				this.misc.showToast('A notification for your requested top up has been sent to your admin. You will receive a notification on approval.');
			})
			.catch(err => {
				this.misc.hideLoader();
				// console.log(err);
			});

		}

		connectWithStripe(){
			this.api.connectWithStripe()
			.then(resp => {
				var red_link = resp.data.account_links.url;
				const browser = this.iab.create(red_link, '_blank');
				browser.on('loadstart').subscribe(event => {
					// console.log(event);
				   	browser.insertCSS({ code: "body{ background-color: red;" });
				   	if((event.url).includes("https://staging.samantapp.com/app/stripe/success/")){
				   		this.ionViewWillEnter();
				   		browser.close();
				   	}
				   	if((event.url).includes("https://staging.samantapp.com/app/stripe/failure/")){
				   		this.ionViewWillEnter();
				   		browser.close();
				   	}

				});
				// this.misc.hideLoader();
				// this.misc.showToast('Funds Requested Succesfully');
			})
			.catch(err => {
				// this.misc.hideLoader();
				// console.log(err);
			});
		}

		openStripeDash(){
			// const browser = this.iab.create("https://staging.samantapp.com/dashboard", '_blank');
			const browser = this.iab.create(this.userDets.stripe_dashboard_link, '_blank');
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

	  	moreTransactions(){

	  	}

}
