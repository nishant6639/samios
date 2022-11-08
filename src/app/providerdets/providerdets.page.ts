import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { FirebaseService } from '../services/firebase.service';
import { ApiService } from '../services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-providerdets',
  templateUrl: './providerdets.page.html',
  styleUrls: ['./providerdets.page.scss'],
})
export class ProviderdetsPage implements OnInit {

	provider_id:any;
	provider:any;
	show:any = 0;
  popup:any = {
    'advance': 0
  };
  exp_lang:any = 0;
  plans:any;
  ordSelDate:any = '';
  userDets:any;
  ordLangSet:any = "";
  ordSelPlan:any = 0;
  offset:any = 0;
  showLoadMore:any = 0;
  showMoreLoad:any = 0;
  @ViewChildren('popupTemp') ces:QueryList<ElementRef>;
  	constructor(private socialSharing: SocialSharing,
    private localNotifications: LocalNotifications,
    private router:Router,
    // private el: ElementRef,
    private route: ActivatedRoute,
    private misc:MiscService,
    private firebase:FirebaseService,
    private api:ApiService,
    public alertController: AlertController) { }

  	ngOnInit() { }

  	ionViewWillEnter() {
      this.show = 0;
      this.exp_lang = 0;
      this.ordLangSet = "";
      this.userDets = this.misc.getUserDets();
	    this.route.params.subscribe(params => {
	        this.provider_id = params['id'];
	        this.getProviderDets();
	    });
	}

	getProviderDets(){
    
		this.api.getProviderDets(this.provider_id)
        .then( response => {
            // console.log(response);
            this.provider = response.data;
            if(this.provider.reviews_text_count > 10){
              this.showLoadMore = 1;
            }
            this.show = 1;
            this.api.getPlans()
            .then( response => {
                // // console.log(response);
                this.plans = response.data.plans;
            })
            .catch(err => {
                this.misc.handleError(err);
            })
        })
        .catch(err => {
            this.misc.handleError(err);
        })
	}

  getMoreReviews(){
    
    this.offset++;
    
    var data = {
      'offset': this.offset,
      'provider': this.provider_id
    };
    this.showMoreLoad = 1;
    this.api.getMoreReviews(data)
    .then( response => {
      this.provider.reviews = (this.provider.reviews).concat(response.data.reviews);
      
      if(response.data.reviews_text_count > ((this.offset+1)*10)) {
        this.showLoadMore = 1;
      }
      else{
        this.showLoadMore = 0;
      }
      this.showMoreLoad = 0;
    })
    .catch(err => {
      this.showMoreLoad = 0;
    });


  }

  addDate(event) {
      if(this.ordLangSet == ""){
        this.misc.showToast('Please select languages');
        return;
      }
      this.ordSelDate = (event.date).toISOString();
      this.ordSelPlan = event.for;
      // console.log(this.ordSelDate);
      setTimeout(()=>{
        this.addDateMid(event);
      }, 100);
      // // console.log(this.ces._results[0].nativeElement.innerHTML);
  }

  async addDateMid(event){
    // console.log(this.ces.toArray());
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
            this.addDateFun(event);
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

  addDateFun(event){
      
      // this.popup.advance = 0;
      // console.log(event);
      // // console.log(this.ordLangSet);
      var orderDate = this.misc.timeFormat(event.date, event.start_time);
      var langSet = this.ordLangSet.split(',');
      
      var data = {
          'language_from': langSet[0],
          'language_to': langSet[1],
          'service_provider_id': this.provider_id,
          'date': (event.date).toISOString().slice(0, 19).replace('T', ' '),
          'from_time': event.start_time,
          'plan_id': event.for,
          'price': 0
      };

      var d = (event.date);
      var n = d.getDay();

      data['day'] = n;
      
      // console.log(data);
      this.misc.showLoader();
      this.api.hire(data)
      .then(response => {
          if(response.status == 201){
              var order_date = new Date((response.data.order.date + " UTC").replace(/-/g, "/"));
              var trigger_time = new Date(new Date(order_date).getTime() - 300000);
              // console.log(trigger_time);
              this.localNotifications.schedule({
                  title: "Upcoming order.",
                  text: 'Thank you for using Samanta. Your interpreter will be online in five minutes.',
                  trigger: {at: trigger_time},
                  led: 'FF0000',
                  sound: null
              });
              var message = {
                'type': 'order_requested',
                'order': response.data.order
              };
              this.firebase.sendCallMsgsFn(response.data.order.service_provider_id, JSON.stringify(message));
              this.misc.hideLoader();
              this.router.navigate(['/home']);
          }
      })
      .catch(err => {
          this.misc.hideLoader();
          console.log(err);
          this.misc.handleError(err);
      });
  }


  shareProfile(){
    // if(this.userDets.image_url == null){
      var image = 'https://staging.samantapp.com/images/logo.png';
    // }
    // else{
      // var image = this.userDets.image_url;
    // }
    //body, subject, image, url
    this.socialSharing.share("Hire "+this.provider.user.name+" at Samanta by clicking on the given link.", "View "+this.provider.user.name+"'s profile", image, 'https://staging.samantapp.com/app/provider/'+this.provider_id).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}