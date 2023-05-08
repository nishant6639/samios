import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { FirebaseService } from '../services/firebase.service';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
// import OneSignal from 'onesignal-cordova-plugin';
import { Platform } from '@ionic/angular';

declare var require: any;
const axios = require('axios').default;
axios.defaults.headers.common['Content-Type'] = 'application/json'; // for POST requests
const apiUrl = "https://staging.samantapp.com/api/";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
    private router:Router,
    private platform:Platform,
    private misc: MiscService,
    private call: CallService,
    private firebase: FirebaseService,
    // private firebasex: FirebaseX
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    	// return true;
      // console.log(route['_routerState'].url);
    	return this.checkLogin(route['_routerState'].url);
  	}


  	checkLogin(route){
      // alert('called');
  		var token = localStorage.getItem('token');
      if(token){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
      }
      else{
        axios.defaults.headers.common['Authorization'] = 'Bearer ';
      }

    
      var jan = new Date( 2009, 0, 1, 2, 0, 0 ), jul = new Date( 2009, 6, 1, 2, 0, 0 );
      var offset = ( jan.getTime() % 24 * 60 * 60 * 1000 ) > ( jul.getTime() % 24 * 60 * 60 * 1000 )?jan.getTimezoneOffset() : jul.getTimezoneOffset();
      var fcm = "";
      this.platform.ready().then(() => {

        var data = {
          'time_offset': offset
        };

        axios.post(apiUrl + 'auth/user-profile', data)
        .then(response => {
          console.log('userDetsssssss', response);
          this.misc.setUserDets(JSON.stringify(response.data));
          this.call.init(response.data.id);
          this.firebase.init(response.data);
          if(response.data.phone_verified_at == null){
            this.router.navigate(['/otp']);
            return false;
          }
          if(response.data.password_reset_flag == 0){
            this.router.navigate(['/changepassword']);
            return false;
          }
          if(response.data.user_type == 3 && response.data.lang_count == 0 && !(route === '/provider/select-language')){
            this.router.navigate(['/provider/select-language']);
            return false;
          }
          else if(response.data.user_type == 3 && (route === '/provider/select-language') && response.data.lang_count > 0){
            this.router.navigate(['/provider/home']);
            return false;
          }
          return true;
        })
        .catch(err => {
          console.log(err);
          // alert('not logged in');
          console.log(err.response.status);
          if(err.response.status == 401){
            if(this.platform.is('cordova')){
              // alert('sdasd');
              // OneSignal.removeExternalUserId((results:any) => {
              //   // The results will contain push and email success statuses
              //   console.log('Results of removing external user id');
              //   console.log(results);
              //   // Push can be expected in almost every situation with a success status, but
              //   // as a pre-caution its good to verify it exists
              //   if (results.push && results.push.success) {
              //     console.log('Results of removing external user id push status:');
              //     console.log(results.push.success);
              //   }
                
              //   // Verify the email is set or check that the results have an email success status
              //   if (results.email && results.email.success) {
              //     console.log('Results of removoing external user id email status:');
              //     console.log(results.email.success);
              //   }
              // });
              this.call.destroyPeerFn();
            }
            // console.log('not logged in');
              return false;
          }
          else{
            return true;
          }
        });
      })
      .catch(err => {
      });
      
      return true;
    
    // userProfile
  	}
  
}
