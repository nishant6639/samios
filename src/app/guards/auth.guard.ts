import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { FirebaseService } from '../services/firebase.service';

declare var require: any;
const axios = require('axios').default;
axios.defaults.headers.common['Content-Type'] = 'application/json'; // for POST requests
const apiUrl = "https://api.samantapp.com/api/";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router:Router, private misc: MiscService, private call: CallService, private firebase: FirebaseService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    	// return true;
      // console.log(route['_routerState'].url);
    	return this.checkLogin(route['_routerState'].url);
  	}


  	checkLogin(route){
  		var token = localStorage.getItem('token');
      	if(token){
        	axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
      	}
        else{
          axios.defaults.headers.common['Authorization'] = 'Bearer ';
        }

      
        var jan = new Date( 2009, 0, 1, 2, 0, 0 ), jul = new Date( 2009, 6, 1, 2, 0, 0 );
        var offset = ( jan.getTime() % 24 * 60 * 60 * 1000 ) > ( jul.getTime() % 24 * 60 * 60 * 1000 )?jan.getTimezoneOffset() : jul.getTimezoneOffset();
        var data = {
          'time_offset': offset
        };

        // return true;

  		axios.post(apiUrl + 'auth/user-profile', data)
	    .then(response => {
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
	    	// console.log(err.response.status);
	    	if(err.response.status == 401){
	    		// console.log('not logged in');
	    		this.router.navigate(['/login']);
	      		return false;
	    	}
	    	else{
	    		return true;
	    	}
	    });
      
      return true;
  		
      // userProfile
  	}
  
}
