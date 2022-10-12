import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-memberrequests',
  templateUrl: './memberrequests.page.html',
  styleUrls: ['./memberrequests.page.scss'],
})
export class MemberrequestsPage implements OnInit {
  show:any = 0;
  requests:any = [];
  constructor(private misc:MiscService, private api:ApiService, public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.show = 0;
    this.requests = [];
    this.getFundRequests();
  }

  getFundRequests(){
    this.api.getFundRequests()
    .then( response => {
        this.requests = response.data.requests;
        // console.log(this.requests);
        this.show = 1;
    })
    .catch(err => {
        this.misc.handleError(err);
    });
  }


  async appDecReq(req_id, action) {

    if(action == 0){
      var header_text = "Decline Request?";
      var par_text = "Are you sure you want to decline this request for fund?";
    }
    else{
      var header_text = "Accept Request?";
      var par_text = "Are you sure you want to accept this request for fund?";
    }

    const alert = await this.alertController.create({
      cssClass: 'samanta-alert-block',
      header: header_text,
      message: par_text,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: (blah) => {
            // // console.log('Confirm Cancel: blah' + id);
            this.appDecReqFun(req_id, action);
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

  appDecReqFun(req_id, action){
    var data = {
      'req_id': req_id,
      'action': action
    };

    this.show = 0;

    this.api.appDecRequests(data)
    .then( response => {
        if(action == 1){
          this.misc.showToast('Funds allocated succesfully');
        }
        else{
          this.misc.showToast('Funds declined');
        }
        this.show = 0;
        this.getFundRequests();
        // this.requests = response.data.requests;
        // // console.log(this.requests);
        // this.show = 1;
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


}
