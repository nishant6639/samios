import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  	user:any;
  	otpSent:any = 0;
    phone_no:any;
    formModel:any = {};

    pass_flag:any = 0;
    pass_meter_width:any = 0;
	
  	constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {
  	}

  	ionViewWillEnter(){
        this.formModel = {};
        this.otpSent = 0;
        this.pass_flag = 0;
        this.pass_meter_width = 0;
  	}


  	resetPassword(){
  		var data = this.formModel;
		this.misc.showLoader();
		this.api.verifyOtpAndReset(data)
        .then( response => {
            this.misc.hideLoader();
            // console.log(response);
            if(response.status == 201){
            	this.misc.showToast('Password reset successfully. Please login with your new password.');
            	this.router.navigate(['/login']);
            	// this.router.navigate(['/'])
            }
            else{
            	this.misc.showToast('Invalid Verification code. Please try again');
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
        	// this.misc.showToast('Something went wrong. Please resend otp and try again');
            // this.misc.hideLoader();
            this.misc.handleError(err);
        }) 
  	}

    passwordCheck(){
        if(this.formModel.password == this.formModel.confirm_password){
            this.pass_flag = 1;
        }
        else{
            this.pass_flag = 0;
        }

        this.pass_meter_width = 0;


        if((this.formModel.password).length > 8){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[A-Z]/.test(this.formModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[0-9]/.test(this.formModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[^A-Z a-z0-9]/.test(this.formModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        // // console.log((this.formModel.password).length);
        // // console.log(/[A-Z]/.test(this.formModel.password));
        // // console.log(/[0-9]/.test(this.formModel.password));

    }

    resetPw(){
        if(this.otpSent == 0){
            if(this.formModel['email']){
                // this.otpSent = 1;
                var data = {
                    'email': this.formModel['email']
                };
                this.misc.showLoader();
                this.api.sendPwCode(data)
                .then( resp => {
                    this.otpSent = 1;
                    this.misc.hideLoader();
                    // // console.log(resp);
                })
                .catch(err => {
                    this.misc.hideLoader();
                    this.misc.handleError(err);
                });

            }
            else{
                this.misc.showToast('Please enter email');
            }
        }
        else{
            if(this.formModel['otp']){
                // this.otpSent = 1;
                if(this.formModel['password'] && this.formModel['conf_password']){
                    if(this.formModel['password'] == this.formModel['conf_password']){
                        var data_change = {
                            'email': this.formModel['email'],
                            'otp': this.formModel['otp'],
                            'password': this.formModel['password']
                        };
                        this.misc.showLoader();
                        this.api.changePw(data_change)
                        .then( resp => {
                            this.misc.hideLoader();
                            // // console.log();
                            this.misc.showToast('Password Changed. Redirecting..');
                            // // console.log(resp);
                            this.router.navigate(['/login']);
                        })
                        .catch(err => {
                            this.misc.hideLoader();
                            this.misc.handleError(err);
                        });
                    }
                    else{
                        this.misc.showToast('Password and confirm Password do not match');
                        // alert();
                    }
                }
                else{
                    this.misc.showToast('Password and confirm password cannot be empty.');
                    // alert()
                }

            }
            else{
                this.misc.showToast('Please enter verfication code');
                // alert();
            }
        }
    }

  	sendOtpEmail(){

  		var data = this.formModel;

		this.misc.showLoader();
  		this.api.sendOtp(data)
        .then( response => {
            this.misc.hideLoader();
            // console.log(response);
            if(response.status == 200){
            	this.misc.showToast('Verification code Sent.');
            	this.otpSent = 1;
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
