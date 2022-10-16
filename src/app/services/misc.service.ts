import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
// import { PowerManagement } from '@ionic-native/power-management/ngx';
declare var require: any;
const axios = require('axios').default;
// import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json'; // for POST requests
const apiUrl = "https://api.samantapp.com/api/";

@Injectable({
  providedIn: 'root'
})
export class MiscService {
	loading:any;
	backSub:any;
	userDets:any;
  	constructor(
  		private toast:Toast,
  		public loadingCtrl:LoadingController,
  		public platform: Platform,
		private androidPermissions: AndroidPermissions,
		public foregroundService: ForegroundService,
    	private autostart: Autostart,
    	private backgroundMode: BackgroundMode,
    	// private powerManagement: PowerManagement
	) {}

  	getCountryList(){
	  	return axios.get('/assets/jsons/phonecodes.json')
	    .then(function(response){
	      	return response.data;
	    })
	    .catch(function(err){
	      	// console.log(err);
	      	return "Err";
	    });
	}

	getAllPermissions(){
  		this.platform.ready().then(() => {
	      	if (this.platform.is('cordova')) {
	          	this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS, this.androidPermissions.PERMISSION.RECEIVE_BOOT_COMPLETED]);
	          	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
	              	result => {
	              		// console.log('Has permission?', result.hasPermission)
	              		if(result.hasPermission == false){
	              			this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
	              		}
	              	},
	              	err => {
	              		// console.log(err);

	              		this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
	              	}
	          	);

	          	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
	              	result => {
	              		// console.log('Has permission?', result.hasPermission)
	              		if(result.hasPermission == false){
	              			this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECORD_AUDIO]);
	              		}
	              	},
	              	err => {
	              		// console.log(err);

	              		this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
	              	}
	          	);



	          	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECEIVE_BOOT_COMPLETED).then(
	              	result => {
	              		// console.log('Has permission boot?', result.hasPermission)
	              		if(result.hasPermission == false){
	              			this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECEIVE_BOOT_COMPLETED]);
	              		}
	              	},
	              	err => {
	              		// console.log(err);

	              		this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECEIVE_BOOT_COMPLETED)
	              	}
	          	);

	          	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
	              	result => {
	              		// console.log('Has permission?', result.hasPermission)
	              		if(result.hasPermission == false){
	              			this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS]);
	              		}
	              	},
	              	err => {
	              		// console.log(err);

	              		this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
	              	}
	          	);

	          	// this.foregroundService.start('Running in Background', 'Background Service', 'icon', 3, 10);
    			// this.autostart.enable();
    			
        		this.backgroundMode.setDefaults({ silent: true });
    			this.backgroundMode.enable();
    			// this.backgroundMode.on('activate')
    			// .then(() => {
    				// this.backgroundMode.disableWebViewOptimizations();
				this.backgroundMode.disableBatteryOptimizations();
    				// this.backgroundMode.excludeFromTaskList();
				// })
				// .catch(er/r => {
					// c/onsole.log(err);
				// });
    			// // console.log("===============================================================================");
    			// this.powerManagement.dim();
    			// this.powerManagement.setReleaseOnPause(false);
    // 			() => {
				// 	// console.log('Wakelock acquired');
				// }, ()=> {
				// 	// console.log('Failed to acquire wakelock');
				// }
					          	// this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
	           //    	result => // console.log('Has permission?', result.hasPermission),
	           //    	err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
	          	// );

	          	// this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
	           //    	result => // console.log('Has permission?', result.hasPermission),
	           //    	err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
	          	// );
	      	}
  		});
	}


	handleError(err, type=""){
		// console.log(err);
		if(err.response.status == 422){
			if(err.response.data.data){
				var obj = err.response.data.data;
			}
			else{
				var obj = err.response.data;
			}
			Object.entries(obj).forEach(([key, value])=> {
				// console.log(value);
				this.toast.show(value[0], '5000', 'center').subscribe(
				  	toast => {
				    	// console.log(toast);
				  	}
				);
			});
		}
		if(err.response.status == 401 && type == "login"){
			this.showToast('Invalid Credentials');
		}
	}

	showToast(message){
		this.toast.show(message, '5000', 'bottom').subscribe(
		  	toast => {
		    	// console.log(toast);
		  	}
		);
	}

	showLoader(){
		// this.loading = await this.loadingCtrl.create({
		//     message: 'Please wait...',
		//     spinner: 'crescent'
	 //  	});

	 //  	await this.loading.present();
	 	document.getElementById('taskLoader').style.display = "block";
	}

	hideLoader(){
		// if(this.loading != undefined){
		// 	this.loading.dismiss();
		// }

	 	document.getElementById('taskLoader').style.display = "none";
	}


	backExitSub(){
		let a =0;
		this.platform.ready().then(() => {
	      	this.backSub = this.platform.backButton.subscribeWithPriority(9999, () => {
	      		a++;
	      		if(a == 1){
	      			this.toast.show('Press back again to exit..', '2000', 'bottom').subscribe(
					  	toast => {
					    	// console.log(toast);
					  	}
					);
	      		}
		        if (a == 2) { // logic for double tap
		          navigator['app'].exitApp();
		        }
      		});
  		});

	}

	backExitUnsub(){
		this.backSub.unsubscribe();
	}

	getLocalTime(date, start_time){
		// return 
	}

	timeFormat(inDate, inTime){
		var date = new Date(inDate);
		var time = new Date("1970-01-01 " + this.getTimeTF(inTime));
		var data = {
			'date': date.getUTCFullYear()+"/"+(date.getUTCMonth()+1)+"/"+date.getUTCDate(),
			'start_time': time.getUTCHours()+":"+time.getUTCMinutes()+":00"
		};
		return data;
		// // console.log((date.getMonth()+1) + '/' + date.getDate() + '/' +  date.getFullYear());
	}

	getTimeTF(inTime){
		return inTime;
    	// let hours24;
			// let ampm = inTime.split(" ")[1];
	  // 	let time = inTime.split(" ")[0];
		 //  if (ampm == "PM" || ampm == "pm") {
		 //    let hours = time.split(":")[0];
		 //    let minutes = time.split(":")[1];
		 //    // let seconds = time.split(":")[2];
		 //    if(hours == '12'){
		 //    	hours24 = 12;
		 //    }
		 //    else{
		 //    	hours24 = parseInt(hours) + 12;
		 //    }
		 //    return hours24 + ":" + minutes+":00";
		 //  } else {
		 //    return time+":00";
		 //  }
	}

	twoDigits(d) {
	    if(0 <= d && d < 10) return "0" + d.toString();
	    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	    return d.toString();
	}

	jsTimetoSQL(dt){
		return this.twoDigits(dt.getUTCHours()) + ":" + this.twoDigits(dt.getUTCMinutes()) + ":" + this.twoDigits(dt.getUTCSeconds());
	}

	jsDatetoSQL(dt){
		return dt.getUTCFullYear() + "-" + this.twoDigits(1 + dt.getUTCMonth()) + "-" + this.twoDigits(dt.getUTCDate());
	}

	sqlToDate(timestamp) {
	    //function parses mysql datetime string and returns javascript Date object
	    //input has to be in this format: 2007-06-05 15:26:02
	    var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
	    var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
	    return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
	  }


	getUserDets(){
		this.userDets = window.localStorage.getItem('user');
		return JSON.parse(this.userDets);
	}

	setUserDets(userDets){
		this.userDets = window.localStorage.setItem('user', userDets);
		// return JSON.parse(userDets);
	}

}