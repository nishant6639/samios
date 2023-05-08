import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare var require: any;
const axios = require('axios').default;
axios.defaults.headers.common['Content-Type'] = 'application/json'; // for POST requests
const apiUrl = "https://staging.samantapp.com/api/";

@Injectable({
  providedIn: 'root'
})

export class NoauthGuard implements CanActivate {
	constructor(private router:Router) { }
  	canActivate(
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    		return this.checkLogin();
  	
  	}

  	async checkLogin(){
  		
  		var token = localStorage.getItem('token');
		if(token){
			axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		}
			var jan = new Date( 2009, 0, 1, 2, 0, 0 ), jul = new Date( 2009, 6, 1, 2, 0, 0 );
					var offset = ( jan.getTime() % 24 * 60 * 60 * 1000 ) > ( jul.getTime() % 24 * 60 * 60 * 1000 )?jan.getTimezoneOffset() : jul.getTimezoneOffset();
			var data = {
			'time_offset': offset
		};

  		return await  axios.post(apiUrl + 'auth/user-profile', data)
	    	.then(response => {
			// return false;
			// // console.log(response);
			if(!(response.data.user_type == 3)){
				this.router.navigate(['/home']);
			}
			else{
				this.router.navigate(['/provider/home']);
			}
			// this.router.navigate(['/login']);
		})
		.catch(err => {
			// // console.log(err.response.status);
			if(err.response.status == 401){
				// console.log('not logged in');
				// this.router.navigate(['/login']);
				return true;
			}
			else{
				return false;
			}
	    	});
	    	// return true;
  		// userProfile
  	} 
}