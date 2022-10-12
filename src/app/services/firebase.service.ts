import { Injectable, NgZone } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { ApiService } from './api.service';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@Injectable({
  	providedIn: 'root'
})
export class FirebaseService {
	public providerBookingsFn: (order_id) => void;
	public UserWaitFn: (order_id) => void;
	public UserAcceptFn: () => void;
	public incomingCall: (data) => void;
	public receiverEn: (data) => void;
	public FireCallMsg: (msg) => void;
	public sendCallMsgsFn:(id, message) => void;
	permReq:any = 0;
	// pushObject:PushObject;
  	constructor(private firebase: FirebaseX, private api:ApiService,
    	private backgroundMode: BackgroundMode,
    	public platform: Platform,
    	private _ngZone: NgZone) {}

  	init(user){
  		this.platform.ready().then(() => {
	      	if (this.platform.is('cordova')) {

	      		this.firebase.hasPermission()
	      		.then(success => {
	      			if(success){
	      				this.getTokenFun();
	      			}
	      			else{
	      				this.requestPerm();
	      			}
	      		})
	      		.catch(err => {
      				this.requestPerm();
	      		});
			}
		});
  	}

  	setPermReq(){
  		this.permReq = 1;
  	}

  	getTokenFun(){
  		this.firebase.getToken()
		.then(token =>{
		    // console.log('fcmget'+token);
		    this.setUserToken(token);
		})
		.catch( err => {
			// console.log('Create channel error: ' + err);
		});

		this.firebase.onTokenRefresh()
		.subscribe(token =>{
		    // console.log('fcmref'+token);
		    this.setUserToken(token);
		});

  		var channel:any  = {
  			name: "call",
		    id: "call_channel",
		    sound: "ring",
		    vibration: true,
		    importance: 4,
		    badge: true,
		    visibility: 1
		};

		this.firebase.createChannel(channel)
		.then(() =>{
		    // console.log('Channel created: ' + channel.id);
		})
		.catch( error => {
		   // console.log('Create channel error: ' + error);
		});

  	}

  	requestPerm(){
  		this.firebase.grantPermission()
  		.then(success => {
  			// console.log(success);
  			if(success){
  				this.getTokenFun();
			}
			else{
				// this.requestPerm();
				if(this.permReq == 0){
					this.permReq = 1;
					document.getElementById('notePerm').style.display = "block";
				}
			}
  		})
  		.catch(err => {
			
			if(this.permReq == 0){
				this.permReq = 1;
				document.getElementById('notePerm').style.display = "block";
			}
  		});
  	}

  	setUserToken(token){
	  	var data = {
	  		'fbs_token': token
	  	};
	  	this.api.setUserFbToken(data)
	   	.then( resp => {
	     	// console.log(resp);
		    this.listenToMessage();
	   	})
	   	.catch( err =>{

	   	});
  	}

  	listenToMessage(){
  		this.firebase.onMessageReceived()
  		.subscribe(data => {
  			var messagebody = JSON.parse(data.message);
			if(messagebody.type == 'order_requested'){
		  		
			}
			if(messagebody.type == 'incoming_call'){
					// alert('dsfdsf');
				this._ngZone.run(() => {
					var incomingData = {
						'order' : messagebody.order_dets,
						'user' : messagebody.user_dets,
						'my_user_id' : messagebody.my_user_id
					};
					this.incomingCall(incomingData);
				});
				this.backgroundMode.moveToForeground();
				// Turn screen on
				this.backgroundMode.wakeUp();
				// Turn screen on and show app even locked
				this.backgroundMode.unlock();
			}
			if(messagebody.type == 'receiver_enabled'){

			}
			if(messagebody.type == 'order_updated'){

			}

			if(messagebody.type == 'order_accepted'){
		  		
			}

			if(messagebody.type == 'in_call_messages'){
		  		
			}
  		});
  	}

  	unregisterFb(){
  		this.firebase.setAutoInitEnabled(false)
  		.then(() => {
  			// console.log("Auto init has been disabled. Removing token.");
		    this.firebase.unregister();
  		})
  		.catch( eerr => {
  			// console.log("Auto init Err.");
  		});
  		// this.firebase.unregister();
  	}

  	initProviderBooking(fn: () => void){
  		this.providerBookingsFn = fn;
  	}

  	initIncoming(fn: () => void){
  		this.incomingCall = fn;
  	}

  	initReceiver(fn: () => void){
  		this.receiverEn = fn;
  	}

  	initReceiveMsg(fn: () => void){
  		this.FireCallMsg = fn;
  	}



  	initUserWaitFn(fn: () => void){
  		this.UserWaitFn = fn;
  	}

  	initUserAccept(fn: () => void){
  		this.UserAcceptFn = fn;
  	}


  	initSendCallMsg(fn: () => void){
  		this.sendCallMsgsFn = fn;
  	}


}
