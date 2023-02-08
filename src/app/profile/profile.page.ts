import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import { FirebaseService } from '../services/firebase.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';

import { Platform } from '@ionic/angular';
@Component({
  	selector: 'app-profile',
  	templateUrl: './profile.page.html',
  	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	userDets:any = "";
  	// @ViewChildren('popupTemp') ces:QueryList<ElementRef>;
  	constructor(private socialSharing: SocialSharing,
    public alertController: AlertController,
    private misc:MiscService,
    private call:CallService,
    private platform:Platform,
    private api:ApiService,
    private firebase:FirebaseService,
    private router:Router) {}

  	ngOnInit() { }

  	ionViewDidEnter() {
	  	this.getNotes();
	}

	getNotes(){
		this.api.getUser()
		.then(response =>{
			this.userDets = response;
		})
		.catch(err => {

		});
	}

	
	async deleteUserMid(){
      	// var htm = this.ces.toArray()[0].nativeElement.innerHTML;
      	const alert = await this.alertController.create({
	      	cssClass: 'samanta-alert-block',
	      	header: 'Delete you account?',
	      	message: '<p class="text-center">If you proceed, your account will be deleted. Kindly contact help & support if you have any fund left in your wallet. Press yes to proceed or return to cancel?</p>',
	      	buttons: [
	        	{
	          		text: 'Yes',
	          		handler: (blah) => {
	            		// // console.log('Confirm Cancel: blah' + id);
	            		this.deleteUser();
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

	deleteUser() {
		this.firebase.unregisterFb();
		this.api.deleteCurrentUser()
		.then(response =>{
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('user');
      		this.router.navigate(['/login']);
		})
		.catch(err => {

		});
	}


	logoutUser(){
		this.call.destroyPeerFn();
		// this.firebase.unregisterFb();
		this.api.logoutUser()
		.then(response =>{
			if(this.platform.is('cordova')){
				OneSignal.removeExternalUserId();
			}
      		this.router.navigate(['/login']);
		})
		.catch(err => {

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
		this.socialSharing.share("Hire "+this.userDets.name+" at Samanta by clicking on the given link.", "View "+this.userDets.name+"'s profile", image, 'https://staging.samantapp.com/app/provider/'+this.userDets.id).then(() => {
		  // Success!
		}).catch(() => {
		  // Error!
		});
	}

}
