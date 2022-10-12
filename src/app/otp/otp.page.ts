import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  	selector: 'app-otp',
  	templateUrl: './otp.page.html',
  	styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
	user:any;
	phone_no:any;
    showCodeField:any = 1;
	formModel:any = {};
  	constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {
  	}

  	ionViewWillEnter(){
        this.showCodeField = 1;
  		this.user = this.misc.getUserDets();
  		this.phone_no = this.user.phone_no;
  	}

    takeAction(event){
        if(event.action == "done"){
            this.showCodeField = 0;
        }
    }


  	verifyOtp(){
  		var data = this.formModel;
		data['phone_no'] = this.phone_no;
		this.misc.showLoader();
		this.api.verifyOtp(data)
        .then( response => {
            this.misc.hideLoader();
            // console.log(response);
            if(response.status == 200){
            	var user = this.misc.getUserDets();
            	this.misc.showToast('Verification succesfully. Redirecting');
            	// if(this.user.user_type == 4){
	            	// this.router.navigate(['/home']);
	            // }

	            // else{
	            	this.router.navigate(['/dp']);
	            // }
            	// this.router.navigate(['/'])
            }
            else{
            	this.misc.showToast('Invalid verification code. Please try again');
            }
            // var token = response.data.token;
            // var user = JSON.stringify(response.data.user);
            // window.localStorage.setItem('token', token);
            // window.localStorage.setItem('user', user);
            // this.misc.setUserDets(user);
            // if(data['user_type'] == 3){
            //     this.router.navigate(['/otp']);
            // }
            // else{
            //     this.router.navigate(['/otp']);
            // }
        })
        .catch(err => {
            this.misc.hideLoader();
        	this.misc.showToast('Something went wrong. Please resend verification code and try again');
            // this.misc.hideLoader();
            // this.misc.handleError(err);
        }) 
  	}

  	sendOtp(){
  		var data = {
  			'phone_no': this.phone_no
  		};

		this.misc.showLoader();
  		this.api.sendOtp(data)
        .then( response => {
            this.misc.hideLoader();
            // console.log(response);
            if(response.status == 200){
                this.showCodeField = 1;
            	this.misc.showToast('Verification code Sent.');
            }
            // var token = response.data.token;
            // var user = JSON.stringify(response.data.user);
            // window.localStorage.setItem('token', token);
            // window.localStorage.setItem('user', user);
            // this.misc.setUserDets(user);
            // if(data['user_type'] == 3){
            //     this.router.navigate(['/otp']);
            // }
            // else{
            //     this.router.navigate(['/otp']);
            // }
        })
        .catch(err => {
            this.misc.hideLoader();
        	this.misc.showToast('Something went wrong.');
            // this.misc.hideLoader();
            // this.misc.handleError(err);
        })
  	}

}
