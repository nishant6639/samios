import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { CallService } from '../services/call.service';
import { FirebaseService } from '../services/firebase.service';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-hire',
  templateUrl: './hire.page.html',
  styleUrls: ['./hire.page.scss'],
})
export class HirePage implements OnInit {

	provider_id:any;
	provider:any;
	show:any = 0;
	ordLangSet:any;
	planId:any = 0;
	showWait:any = 0;
  bookAccepted:any = "";
  bookData:any;
  plans:any;
  timeLeft:any = 120;
  exp_lang:any = 0;
  order:any;
  timeInt:any = "";
  ordSelDate:any = "";
  ordSelPlan:any = 0;
  userDets:any;
  countPer:any = 0;
  lang_from:any = "";
  lang_to:any = "";
  @ViewChildren('popupTemp') ces:QueryList<ElementRef>;
  @ViewChild('cnt', { static: false }) private countdown: any;
  	constructor(private router:Router,
    // private localNotifications: LocalNotifications,
    private route: ActivatedRoute,
    private misc:MiscService,
    private api:ApiService,
    private calling:CallService,
    private firebase:FirebaseService,
    public alertController: AlertController) {}

  	ngOnInit() {

  	}

  	ionViewWillEnter() {
      this.show = 0;
      this.showWait = 0;
      this.bookAccepted = "";
      this.bookData = [];
      this.ordLangSet = "";
      this.order = {};
      this.userDets = this.misc.getUserDets();
      this.firebase.initUserWaitFn(this.userWait.bind(this));
	    this.route.params.subscribe(params => {
	        this.provider_id = params['id'];
	        this.getProviderDets();
	    });
	}

  countEvent(event){
    // console.log(event);
    this.timeLeft = event.left;
    console.log(this.timeLeft);
    this.timeInt = setInterval(()=>{
      this.timeLeft = this.countdown.left;
    });
    if(event.action == 'done'){
      clearTimeout(this.timeInt);
      var data = {
        'order_id': this.order.id
      };
      this.api.hireTimeComplete(data)
      .then(resp => {
        if(!(resp.data.status == 1)){
          this.misc.showToast('Service provider did not accept the call request in the prescribed time.');
          // console.log('Service provider did not accept the call request in the prescribed time.');
          this.router.navigate(['/home']);
        }
        else{
          this.userWait(resp.data.order);
        }
      })
      .catch(err => {

      });
    }
  }

  takeAction(event){
    // console.log(event);
    clearInterval(this.timeInt);
    if(event == 'done' && this.bookAccepted == -1){
      this.misc.showToast('Service provider did not accept the call request in the prescribed time. Please check the bookings section for further updates.');
      this.router.navigate(['/home']);
    }
  }

	getProviderDets(){
		this.api.getProviderDets(this.provider_id)
    .then( response => {
        // // console.log(response);
        this.provider = response.data;
        this.api.getPlans()
        .then( response => {
            // // console.log(response);
            this.plans = response.data.plans;
            this.show = 1;
        })
        .catch(err => {
            this.misc.handleError(err);
        })
        // this.show = 1;
    })
    .catch(err => {
        this.misc.handleError(err);
    })
	}

  hireNow() {
    if(this.ordLangSet == ""){
      this.misc.showToast('Please select languages');
      return;
    }
    this.ordSelDate = new Date().toISOString();
    this.ordSelPlan = this.planId;
    // setTimeout(()=>{
    this.hireNowMid();
    // }, 100);
    // const alert = await this.alertController.create({
    //   cssClass: 'samanta-alert-block',
    //   header: 'Cancel booking?',
    //   message: 'You will be charged for this service. Press yes to proceed or return to cancel?',
    //   buttons: [
    //     {
    //       text: 'Yes',
    //       handler: (blah) => {
    //         // // console.log('Confirm Cancel: blah' + id);
    //         this.hireNowFun();
    //       }
    //     }, {
    //       text: 'Return',
    //       cssClass: 'secondary',
    //       handler: () => {
    //         // console.log('No');
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

  async hireNowMid(){
      var htm = this.ces.toArray()[0].nativeElement.innerHTML;
      const alert = await this.alertController.create({
      cssClass: 'samanta-alert-block',
      header: 'Confirm booking?',
      message: htm+'<p class="text-center">You will be charged for this service. Press yes to proceed or return to cancel?</p>',
      buttons: [
        {
          text: 'Yes',
          handler: (blah) => {
            // // console.log('Confirm Cancel: blah' + id);
            this.hireNowFun();
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

	hireNowFun(){
		// console.log(this.ordLangSet);
      // var orderDate = this.misc.timeFormat(event.date, event.start_time);
      var langSet = this.ordLangSet.split(',');
      var data = {
          'language_from': langSet[0],
          'language_to': langSet[1],
          'service_provider_id': this.provider_id,
          'date': new Date().toISOString().slice(0, 19).replace('T', ' '),
          // 'from_time': this.misc.jsTimetoSQL(new Date()),
          'plan_id': this.planId,
          'price': 0
      };
      var d = new Date();
      var n = d.getDay();
      data['day'] = n;
      data['from_time'] = this.formatAMPM(new Date());
      // console.log(data);
          // this.showWait = 1;
      this.misc.showLoader();
      this.api.hire(data)
      .then(response => {
        if(response.status == 201){
          this.order = response.data.order;
          
          var message = {
            'type': 'order_requested',
            'order': response.data.order
          };
          this.firebase.sendCallMsgsFn(response.data.order.target_user, JSON.stringify(message));
          
          // var order_date = this.order.date+" UTC";
          // var trigger_time = new Date((new Date(new Date(order_date).getTime() - 300000)).toISOString());
          // // console.log(trigger_time);
          // this.localNotifications.schedule({
          //     title: "Upcoming order.",
          //     text: 'Thank you for using Samanta. Your interpreter will be online in five minutes.',
          //     trigger: {at: trigger_time},
          //     led: 'FF0000',
          //     sound: null
          // });
          this.showWait = 1;
          this.misc.hideLoader();
        }

      })
      .catch(err => {
        this.misc.hideLoader();
        this.misc.handleError(err);
      
      });
	}

  formatAMPM(date){
    // var hours = date.getHours();
    // var minutes = date.getMinutes();
    // var ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    // var strTime = hours + ':' + minutes + ' ' + ampm;
    // return strTime;

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = ':00';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return strTime;
  }

	onDragUp(){

	}

  userWait(order){

    // var data = {
    //   'order_id': order_id
    // };
    clearTimeout(this.timeInt);
    if(!(order.status == -1 || order.status == 0)){
      this.bookAccepted = 1;
      clearInterval(this.timeInt);
      this.bookData = order;
    }
    else{
      this.bookAccepted = 0;
      clearInterval(this.timeInt);
      this.misc.showToast('Service provider did not accept the call request');
      this.router.navigate(['/home']);
    }
    // this.api.getOrderDetails(data)
    // .then(resp => {
    //     if(resp.data.order.status == 1){
    //     }
    //     else{
          
    //     }
    // })
    // .catch(err => {

    // });
  }

  callUser(id, order_id){
    this.calling.call(id, order_id);
    this.router.navigate(['/home']);
    this.bookData = [];
  }

  setLangNameFun(lang1, lang2){
    this.lang_from = lang1;
    this.lang_to = lang2;
  }

  ionViewWillLeave(){
    if(!(this.timeInt == "")){
      clearInterval(this.timeInt);
    }
  }




}
