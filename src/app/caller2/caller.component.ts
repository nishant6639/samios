declare var Peer;
import { Component, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute } from '@angular/router';
// import Peer from 'peerjs';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import { MiscService } from '../services/misc.service';
import OneSignal from 'onesignal-cordova-plugin';
import { FirebaseService } from '../services/firebase.service';
import { Platform } from '@ionic/angular';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
declare let cordova:any;
declare let ConnectyCube:any;
declare let AudioToggle:any;

declare var require: any;
const axios = require('axios').default;

// require('connectycube/lib/videocalling/cubeWebRTCConstants').PeerConnectionState;

@Component({
	selector: 'app-caller2',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {

	activeScreen:any = 1;
	// userDets:any = {};
	userDets:any = null;
	lastUser:any = null;
	session:any;
	order:any = {};
	message:any = "";
	chatWin:any = 0;
	waitForAccept:any = 0;
	newChat:any = 0;
	prev_conn_val:any = true;
	chatMsgs:any = [];
	other_user:any = {};
	incoming:any = 0;
	on_call:any = 0;
	outgoing:any = 0;
	ringing:any = 0;
	videoDevices:any = [];
	audioDevices:any = [];
	audioOutDevices:any = [];
	video_muted:any = 0;
	audio_muted:any = 0;
	connected:any = 0;
	appOpen:any = 0;
	cordovaCall:any;
	reject_request:any = 0;
	showDevicesList:any = 0;
	video_device_selected:any = "";
	audio_device_selected:any = "";
	localStream:any;
	timeInt:any;
	noteInt:any;
	showTopPerm:any = 0;
	callStartTime:any;
	audio_out_mode:any = 0;
	activeCamera:any=0;
	callExtended:any = 0;
	callExtendShown:any = 0;
	callExtendRequest:any = 0;
	callExtendRequested:any = 0;
	rem_text:any= "";
	minutes:any="";
	seconds:any = "";
	callToEnd:any;
	overlayMsg:any = "";
	userLoggedIn:any = 0;
	ConnectyCubeUser:any = {};
	itemRef: AngularFireObject<any>;
	noteRef: AngularFireObject<any>;
	callRef: AngularFireObject<any>;
	noteRefSub:any;
	itemRefSub:any;
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
	bookingRequest:any = "";
	ongoingCall:any = "";
	showVideoPermPop:any=0;
	showAudioPermPop:any=0;
	inc_count:any = 0;
	inc_count_reject:any = 0;
	constructor(
		private call:CallService,
		private misc:MiscService,
		private api:ApiService,
		private firebase:FirebaseService,
		private router:Router,
		// private firebasex: FirebaseX,
		private diagnostic: Diagnostic,
		private platform: Platform,
		private _ngZone: NgZone,
		private db: AngularFireDatabase
	) {

		// this.call.initChatData(this.getChatData.bind(this));

		this.call.initCall(this.callInit.bind(this));
		
		// this.firebase.initProviderBooking(this.showAcceptToast.bind(this));

		// this.firebase.initIncoming(this.incomingCall.bind(this));

		// this.firebase.initReceiver(this.receiverEnabled.bind(this));

		// this.firebase.initReceiveMsg(this.receiveFireMsg.bind(this));

		this.firebase.initSendCallMsg(this.sendCallMsgs.bind(this));
		
		// this.call.initChatData(this.getChatData.bind(this));

		// this.call.initCall(this.callInit.bind(this));

		this.call.initDestroy(this.callDestroy.bind(this));

		this.platform.ready().then(() => {

			if(this.platform.is('android')){
				// this.firebasex.onMessageReceived()
	        	// .subscribe(data => {
	        	// 	console.log(data);
	        	// 	if(data.notification_foreground){
	        	// 		this._ngZone.run(() => {
		        // 			this.overlayMsg = "Waiting for Incoming Call";
		        // 			// alert('incoming');
	        	// 		});
	    		// 	}
	        	// 	// this.sendAppToBackground();
	        	// });
	        	this.platform.resume.subscribe(() => {     
	    	 		this.checkTopPerm();
					this.getPopupEvents();
			 	});
        	}

			if(this.platform.is('ios')){
				
				document.addEventListener("offline", () => {
				}, false);

				document.addEventListener("online", () => {
					// if(!(ConnectyCube.chat.isConnected)){
					console.log('chat connected: ', ConnectyCube.chat.isConnected);
						// this.listenEvents();
						// return;
					// }
					console.log('****APP online**** => log start time');
		    	 	// alert('ssdsd');

					// if(ConnectyCube.chat.isConnected == false){
			    	 	// setTimeout(() => {
			    	 		this.api.getUser()
					 		.then(resp => {
					 			this.userDets = resp;
					 			this.lastUser = null;
				    	 		this.checkTopPerm();
								// this.getPopupEvents();
				    	 		// this.initServ();
				    	 		this.initCallService();
				        		this.receiveMessage();
				        		// this.OneSignalInit();
				        		this.lastUser = this.userDets;
					 		})
					 		.catch(err => {
					 			console.log(err);
					 		});
			    	 	// }, 100);
		    	 	// }
				}, false);

				this.platform.resume.subscribe(() => {     
					console.log('chat connected: ', ConnectyCube.chat.isConnected);
					// if(ConnectyCube.chat.isConnected == false){ 
			    	 	console.log('****APP RESUMED**** => log start time');
			    	 	// alert('ssdsd');
			    	 	// setTimeout(() => {
			    	 		this.api.getUser()
					 		.then(resp => {
					 			this.userDets = resp;
					 			this.lastUser = null;
				    	 		this.checkTopPerm();
								// this.getPopupEvents();
				    	 		// this.initServ();
				    	 		this.initCallService();
				        		this.receiveMessage();
				        		// this.OneSignalInit();
				        		this.lastUser = this.userDets;
					 		})
					 		.catch(err => {
					 			console.log(err);
					 		});
			    	 	// }, 100);
		    	 	// }
			 	});
		 	}
		});

	 	// this.platform.resume.subscribe(() => {
	 	// 	try {
		// 		console.log('destroy previous instance of connectycube');
		// 	  	await ConnectyCube.destroySession();
		// 		// ConnectyCube.videochat.onCallListener = undefined;
		// 		// ConnectyCube.videochat.onAcceptCallListener = undefined;
		// 		// ConnectyCube.videochat.onRejectCallListener = undefined;
		// 		// ConnectyCube.videochat.onStopCallListener = undefined;
		// 		// ConnectyCube.videochat.onUserNotAnswerListener = undefined;
		// 		// ConnectyCube.videochat.onRemoteStreamListener = undefined;
		// 		// ConnectyCube.videochat.onDevicesChangeListener = undefined;
		// 		console.log('destroy previous instance of connectycube finished');
		// 	}
		// 	catch(err) {
		// 		console.log('Previous instance of connectycube not found');
		// 		console.log(err);
		// 	}
	 	// }
		// this.call.initDestroy(this.callDestroy.bind(this));

	}

	ngAfterViewInit(){
		
    	this.listenEvents();
		this.checkTopPerm();
		this.getPopupEvents();
		this.initServ();

		this.router.events.forEach((event) => {
			// console.log('sdfsdf');
	      	if(event instanceof NavigationEnd) {

				console.log('nav end');
				this.checkTopPerm();
				this.getPopupEvents();
				// var last_user = this.userDets;
				this.initServ();
				// if((!(this.userDets == undefined))){
				// 	this.userLoggedIn = 1;
				// 	if(last_user == undefined || (!(last_user.id == this.userDets.id))){
				// 	}
				// }
        	}
    	});
	}

	initServ(){

		this.userDets = this.misc.getUserDets();
		// console.log('user1', last_user);
		// console.log('user2', this.userDets);
		if(!(this.userDets == null || this.userDets == undefined || this.userDets.id == undefined)) {
			if(!(this.lastUser == null)){
				if(this.userDets.id == this.lastUser.id){
					console.log('Same user. Skipping Initialize.');
				}
				else{
					console.log('User changed. Initializing peer.');
					this.initCallService();
	        		this.receiveMessage();
	        		this.OneSignalInit();
	        		this.lastUser = this.userDets;
				}
			}
			else{
				console.log('New Instance. Initializing peer.');
				// this.peerInit();
				this.initCallService();
        		this.receiveMessage();
        		this.OneSignalInit();
        		this.lastUser = this.userDets;
			}
		}
		else{
			console.log('user undefined');
		}
	}

	checkTopPerm(){
		this.platform.ready().then(() => {
			// alert('dfsdfs');
			if(this.platform.is('android')){
				cordova.plugins.backgroundMode.getForegroundPermissionStatus(res => {
					console.log(res);
					this._ngZone.run(() => {
						if(res == false){
							this.showTopPerm = 1;
						}
						else{
							this.showTopPerm = 0;
						}
					});
				});
			}
		});
	}

	openTopPermission(){
		cordova.plugins.backgroundMode.requestForegroundPermission();
	}

	OneSignalInit(){

		this.platform.ready().then(async () => {

			if(this.platform.is('cordova')){
				// OneSignal.removeExternalUserId();
				// }
				// let externalUserId = 'samnote'+this.userDets.id;
				await OneSignal.promptForPushNotificationsWithUserResponse( async (accepted) => {
		            console.log("User accepted notifications: " + accepted);
		            await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
	          	});
	          	await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
		  		// OneSignal.setExternalUserId(externalUserId);

				OneSignal.setNotificationOpenedHandler((jsonData:any) => {
			      	console.log('notificationOpenedCallback: ', jsonData);
			      	let noteData = jsonData;
			      	if(noteData.notification.additionalData.type == 'incoming_call'){
			      		if(this.appOpen == 0){
			      			this.overlayMsg = "Waiting for Incoming Call";
		      			}
			      	}
			      	let clickAction = "";
			      	if(this.platform.is('ios')){
			      		clickAction = noteData.action.actionID;
		      		}
		      		else{
		      			clickAction = noteData.action.actionId;
		      		}
			      	console.log('Clicked button: ' + clickAction);
			      	
			      	if(clickAction == 'accept'){
			      		if(this.appOpen == 0){
			      			this.overlayMsg = "Accepting Call. Please Wait..";
		      			}
			      		this.acceptCall();
			      	}

			      	if(clickAction == 'decline'){
			      		this.rejectCallBack(noteData.notification.additionalData);
			      		if(this.appOpen == 0){
			      			this.overlayMsg = "Rejecting Call. Please Wait..";
		      			}
			      	}

			      	if(clickAction == 'end_call'){
			      		this.endCall();
			      	}

			  	});


				// OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {
				// 	this.appOpen = 1;
				// 	var data = notificationReceivedEvent.notification.additionalData;
				// 	console.log(notificationReceivedEvent.notification);
				// 	if(!(data == undefined)){
				// 		if(data.type == 'incoming_call'){
				// 			notificationReceivedEvent.complete(notificationReceivedEvent.notification);
				// 		}
				// 		else{
				// 			notificationReceivedEvent.complete(notificationReceivedEvent.notification);
				// 		}
				// 	}
				// 	else{
				// 		notificationReceivedEvent.complete(notificationReceivedEvent.notification);
				// 	}
					
				// 	// this.receiveMessages(notificationReceivedEvent.notification.additionalData);
				// });
			}
		});
	}


	async initCallService(){
		// ConnectyCube.chat.reconnect();
		// await ConnectyCube.logout().catch((error) => {
		// 	console.log(error);
		// });
		try {
			console.log('destroy previous instance of connectycube');
		  	await ConnectyCube.destroySession();
			// ConnectyCube.videochat.onCallListener = undefined;
			// ConnectyCube.videochat.onAcceptCallListener = undefined;
			// ConnectyCube.videochat.onRejectCallListener = undefined;
			// ConnectyCube.videochat.onStopCallListener = undefined;
			// ConnectyCube.videochat.onUserNotAnswerListener = undefined;
			// ConnectyCube.videochat.onRemoteStreamListener = undefined;
			// ConnectyCube.videochat.onDevicesChangeListener = undefined;
			console.log('destroy previous instance of connectycube finished');
		}
		catch(err) {
			console.log('Previous instance of connectycube not found');
			console.log(err);
		}
		
		let CREDENTIALS = {
		  	appId: 6798,
		  	authKey: "KbVKtzAQvPFAdtw",
		  	authSecret: "zrXRtdLamjF7fmq"
		};

		let CONFIG = {
			chat: {
			    reconnectionTimeInterval: 1,
			    ping: {
			      enable: true,
			      timeInterval: 1
			    }
		  	},
			videochat: {
				alwaysRelayCalls: false,
			    answerTimeInterval: 600,
			    dialingTimeInterval: 2
		    },
		  	debug: { mode: 0 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
		};

		await ConnectyCube.init(CREDENTIALS, CONFIG);

		this.userLoggedIn = 1;

		this.platform.ready().then(async() => {
			if(this.platform.is('ios')){
				await cordova.plugins.iosrtc.registerGlobals();
				await cordova.plugins.iosrtc.debug.enable('iosrtc*');
				await cordova.plugins.iosrtc.initAudioDevices();
				await cordova.plugins.iosrtc.selectAudioOutput('speaker');
				await cordova.plugins.iosrtc.turnOnSpeaker(true);
				await AudioToggle.setAudioMode('speaker');
			}
		  	
			// this.cordovaCall = cordova.plugins.CordovaCall;

			// this.userDets = this.misc.getUserDets();
	    	this._ngZone.run(() => {
	    		let userProfile = {
				  	password: "supersecurepwd",
				  	email: this.userDets.email
				};
				ConnectyCube.createSession(userProfile)
			  	.then((session) => {
			  		// let userProfile = {
					//   	password: "supersecurepwd",
					//   	email: this.userDets.email
					// };
					let userCredentials = {
					  	userId: this.userDets.calling_id,
					  	password: "supersecurepwd",
					};
			  		ConnectyCube.chat
				  	.connect(userCredentials)
				  	.then(() => {
					    // connected
					    console.log("connected");
				  	})
				  	.catch((error) => {
				  		console.log(error);
				  	});

					// ConnectyCube.login(userProfile)
				  	// .then((user) => {
				  	// 	console.log('ConnCube',user);
				  	// 	this.ConnectyCubeUser = user;
				  	// })
				  	// .catch((error) => {

				  	// });
			  	})
			  	.catch((error) => {});
		  	});
		});
	}

	async showDevices(){

    	// return;
		ConnectyCube.videochat
	  	.getMediaDevices("videoinput")
	  	.then((devices) => {
		    if (devices.length) {
		    	this.videoDevices = devices;
		      	console.log(devices);
		    }
		    ConnectyCube.videochat
		  	.getMediaDevices("audioinput")
		  	.then((devices) => {
			    if (devices.length) {
			    	this.audioDevices = devices;
			      	console.log(devices);
			    }
			    ConnectyCube.videochat
			  	.getMediaDevices("audiooutput")
			  	.then((devices) => {
				    if (devices.length) {
				    	this.audioOutDevices = devices;
				      	console.log(devices);
				    }
				    this.showDevicesList = 1;
			  	})
			  	.catch((error) => {});
		  	})
		  	.catch((error) => {});

	  	})
	  	.catch((error) => {});
	}

	bringAppToForeground(){
		// this.platform.ready().then( () => {
		if(this.platform.is('android')) {
			cordova.plugins.backgroundMode.wakeUp();
			cordova.plugins.backgroundMode.unlock();
			cordova.plugins.backgroundMode.moveToForeground();
		}
		// });
	}

	sendAppToBackground(){
		this.platform.ready().then( () => {
			if (this.platform.is('android')) {
				// cordova.plugins.backgroundMode.wakeUp();
				// cordova.plugins.backgroundMode.unlock();
				// cordova.plugins.backgroundMode.moveToBackground();
			}
		});
	}

	listenEvents(){
		// cordova.plugins.backgroundMode.on('deactivate', () => {
		// });
		// if(!(ConnectyCube.chat.isConnected)){
		// 	this.listenEvents();
		// 	return;
		// }

		// if(this.connected == 0){

			cordova.plugins.notification.local.on('accept',
			(event) => {
				console.log('Accept clicked', event);
				this.acceptCall();
			},this);
			cordova.plugins.notification.local.on('decline',
			(event) => {
				console.log('decline clicked', event);
				this.rejectCall();
			},this);
			cordova.plugins.notification.local.on('end_call',
			(event) => {
				console.log('End Call clicked', event);
				this.endCall();
			},this);
			console.log('listening for events');
			// var cordovaCall = cordova.plugins.CordovaCall;
	  		
	  		if(this.platform.is('ios')){

		  		cordova.plugins.CordovaCall.on('answer', e => {
		  			// console.log('****APP RESUMED**** => log start time');
		    	 	this.overlayMsg = "Waiting for Incoming Call...";
		  		});


		  		cordova.plugins.CordovaCall.on('hangup', (e) => {
		  			// cordova.plugins.CordovaCall.endCall();
		  			// this.bringAppToForeground();
		  			// this.endCall(0,1);
		  			// alert('call answered');
		  		});


		  		cordova.plugins.CordovaCall.on('reject', (e) => {
		  			// cordova.plugins.CordovaCall.endCall();
		  			// this.bringAppToForeground();
		  			if(this.on_call == 0){
		  				// this.overlayMsg = "Rejecting Call...";
		  				// this.rejectCall();
		  			}
		  			// alert('call answered');
		  		});

	  		}

		  	ConnectyCube.videochat.onUserNotAnswerListener = (session, userId) => {
		  		this._ngZone.run(() => {
			  		if(this.userLoggedIn == 1){
				  		// alert('not answered');
				  		this.misc.showToast("Call not answered by user");
				  		this.endCall(1);
			  		}
		  		});
		  	};

		  	ConnectyCube.videochat.onSessionConnectionStateChangedListener = (session, userID, connectionState) => {
		  		console.log(connectionState);
		  		if(connectionState == ConnectyCube.videochat.SessionConnectionState.FAILED){
		  			this.endCall();
		  		}
		  	};


			ConnectyCube.videochat.onCallListener =  (session, extension) => {
				this._ngZone.run(() => {
					console.log('callListenerActive');
				  	if(this.userLoggedIn == 1){
						console.log('callListenerActive2');

				  		this.session = session;
					  	// alert('incoming');

					  	this.overlayMsg = "";

					  	console.log(this.outgoing+"======"+this.reject_request);
					  	
					  	if(this.outgoing == 0 && this.reject_request == 0){
					  		console.log('call received');
					  		// if(this.incoming == 0){

								this.bringAppToForeground();
					  			this.showIncomingActivity(extension);
					  			// this.acceptCallMidd();
				  			// }
					  		// cordovaCall.receiveCall('David Marcus via Samanta',(e) => {
							// 	console.log('sfsadas', e);
							// },
							// (err) => {
							// 	console.log(err);
							// });
				  		}
				  		// if(this.outgoing == 1){
				  			// alert('ringing');
				  		// }
			  		}
		  		});
			};

			ConnectyCube.videochat.onRemoteStreamListener = (session, userID, remoteStream) => {
			  	this._ngZone.run(() => {
			  		this.getChatData();
				  	if(this.userLoggedIn == 1){
				  		// attach the remote stream to DOM element
					  	session.attachMediaStream("remoteVideoElementId", remoteStream);
						this._ngZone.run(() => {
							this.timeInt = setInterval(()=>{
								this.getRemainingTime();
							}, 1000);
						});
					}
				});
			};

			ConnectyCube.videochat.onAcceptCallListener = (session, userId, extension) => {
				this._ngZone.run(() => {
					console.log('call accepted succesfully');
					this.callStartTime = new Date();
					this.outgoing = 0;
					this.on_call = 1;
					this.acceptCallCallback();
				});
			};

			ConnectyCube.videochat.onRejectCallListener = (session, userId, extension) => {
				this._ngZone.run(() => {
					this.outgoing = 0;
					this.on_call = 0;
					this.rejectCallCallBack();
					this._ngZone.run(() => {
						this.router.navigate(['/summary/'+this.order.id]);
					});
				});
			};

			ConnectyCube.videochat.onStopCallListener = async (session, userId, extension) => {
				this._ngZone.run(() => {
					this.resetAllToDefault();
					if(this.userLoggedIn == 1){
				  		this.stopCallCallBack();
					}
				})
			};

	  		this.connected = 1;
  		// }

	}


	acceptCallMidd(){
		if(this.platform.is('ios')){
			// if(this.incoming == 1){
				if(this.waitForAccept == 1 && this.incoming == 1){
					this.acceptCall();
				}
				else{
					if(this.incoming == 1){
						setTimeout(() => {
							this.acceptCallMidd();
						}, 500);
					}
				}
			// }
		}
	}



	showIncomingActivity(extension){
		// this.overlayMsg = "";
  		this.order = extension.order;
  		this.other_user = extension.other_user;
  		this.callToEnd = extension.callToEnd;
		this.bringAppToForeground();
  		var call_message = {
			'type': 'ringing',
			'value': 1
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		this._ngZone.run(() => {
			this.incoming = 1;
  		});
		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.play();
		}
		// =================
		// Show Notification
		// =================
		this.showIncomingNotification();
	}

	showIncomingNotification(){
		if(this.platform.is('android')){
			cordova.plugins.notification.local.schedule({
			    title: this.other_user.name,
			    text: "Incoming Video Call via Samanta",
			    foreground: true,
			    smallIcon: 'res://ic_stat_onesignal_ring',
			    ongoing: true,
			    priority: 10,
			    channel: 'call_channel_local',
			    actions: [
			        { id: 'accept', title: 'Accept' },
			        { id: 'decline',  title: 'Decline' }
			    ]
			});
		}
	}

	rejectCallCallBack(){
  		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
	}


	stopCallCallBack(){
  		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
		else{
			cordova.plugins.CordovaCall.endCall();
		}
		this.outgoing = 0;
		this.incoming = 0;
		this.on_call = 0;
		cordova.plugins.notification.local.cancelAll();
		clearInterval(this.timeInt);
		this._ngZone.run(() => {
			this.router.navigate(['/summary/'+this.order.id]);
		});
	}

	async rejectAction(){
		await this.resetAllToDefault();
  		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
		else{
			cordova.plugins.CordovaCall.endCall();
		}
		cordova.plugins.notification.local.cancelAll();
		this.setCallLog(this.userDets.id, 'declined', new Date());
		this.incoming = 0;
		this.on_call = 0;
		this._ngZone.run(() => {
			this.router.navigate(['/summary/'+this.order.id]);
		});
	}

	resetAction(){

	}

	getToken(){

		return this.api.getCallToken(1).then(resp => {
			console.log('token data', resp.data.token);
			return resp.data.token;
		})
		.catch(err => {

		});
	}

	callUser(id, order_id){
		this.ongoingCall = "";
	    this.call.call(id, order_id);
  	}

  	resetAllToDefault(){
  		this._ngZone.run(() => {
	  		if(this.localStream){
	  			this.localStream.getTracks().forEach(track => track.stop());
			}

			this.localStream = null;
			// this.session.stop();
	  		this.incoming = 0;
	  		this.activeCamera = 0;
	  		this.audio_out_mode = 0
	  		this.ringing = 0;
	  		this.outgoing = 0;
	  		this.on_call = 0;
	  		this.overlayMsg = "";
	  		this.inc_count = 0;
	  		this.inc_count_reject = 0;
	  		this.audio_muted = 0;
	  		this.video_muted = 0;
	  		this.remote_video_muted = 0;
	  		this.remote_audio_muted = 0;
	  		this.showDevicesList = 0;

  			this.waitForAccept = 0;
	  		// this.order = {};
	  		// this.other_user = {};
	  		this.showVideoPermPop = 0;
			this.showAudioPermPop = 0;

			if(this.timeInt){
				clearInterval(this.timeInt);
			}

			if(this.noteInt){
				clearInterval(this.noteInt);
			}

			// this.callStartTime = 0;
			this.callExtended = 0;
			this.callExtendShown = 0;
			this.callExtendRequest = 0;
			this.callExtendRequested = 0;
			this.rem_text = ""
			this.minutes = "";
			this.seconds = "";
			this.callToEnd = null;
			this.overlayMsg = "";
		});
  	}

	async callInit(order_id){
		if(this.connected == 0){
			setTimeout(() => {
				this.callInit(order_id);
			}, 1000);
			return;
		}
		// setTimeout(() => {
	    	this.router.navigate(['/']);
	    // }, 2000);

		if(this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))) {
			
			// console.log('sdfsfsfsadas');
			// await cordova.plugins.diagnostic.requestCameraAuthorization({
			//     successCallback: (status) => {
			//         console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
			//         cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status){
			// 		   	if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
			// 		       console.log("Microphone use is authorized");
			// 		   	}
			// 		}, (error) => {
			// 		    console.error(error);
			// 		});
			//     },
			//     errorCallback: function(error){
			//         console.error(error);
			//     },
			//     externalStorage: false
			// });
			// await cordova.plugins.diagnostic.getCameraAuthorizationStatus({
			//     successCallback: function(status){
			//         if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
			//             console.log("Camera use is authorized");
			//         }
			//         else{
			//         	console.log("Camera use is unauthorized");
			//         }
			//     },
			//     errorCallback: function(error){
			//         console.error("The following error occurred: "+error);
			//     },
			//     externalStorage: false
			// });

			// await cordova.plugins.diagnostic.getMicrophoneAuthorizationStatus(function(status){
			//    	if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
			//        console.log("Microphone use is authorized");
			//    	}
			// }, function(error){
			//     console.error("The following error occurred: "+error);
			// });
		}
		// alert(order_id);
		this.outgoing = 1;
		var data = {
	      	'order_id': order_id,
	      	'outgoing': 1
	    };
	    return this.api.getOrderDetails(data)
	    .then(resp => {
	    	console.log(resp);
	    	this.order = resp.data.order;
	    	this.other_user = resp.data.user;
	    	if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
	    	this.startCall();
    	})
    	.catch(err => {
    		this.outgoing = 0;
    		this.misc.handleError(err);
    		console.log(err);
    	});

	}


	async startCall(){
		let calleesIds = [this.other_user.calling_id]; // User's ids
		let sessionType = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
		let additionalOptions = {
			bandwidth: 256
		};
		this.session = ConnectyCube.videochat.createNewSession(calleesIds, sessionType, additionalOptions);
		console.log(this.session.ID);
		let mediaParams = {
		  audio: true,
		  video: true
		  // video: {
		  // 	aspectRatio: 9/16
		  // }
		};

		// await cordova.plugins.diagnostic.getCameraAuthorizationStatus({
		// 	    successCallback: function(status){
		// 	        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
		// 	            console.log("Camera use is authorized");
		// 	        }
		// 	        else{
		// 	        	console.log("Camera use is unauthorized");
		// 	        }
		// 	    },
		// 	    errorCallback: function(error){
		// 	        console.error("The following error occurred: "+error);
		// 	    },
		// 	    externalStorage: false
		// 	});

		// 	await cordova.plugins.diagnostic.getMicrophoneAuthorizationStatus(function(status){
		// 	   	if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
		// 	       console.log("Microphone use is authorized");
		// 	   	}
		// 	}, function(error){
		// 	    console.error("The following error occurred: "+error);
		// 	});
		// console.log('Fetching stream');
		if (this.localStream){
            /* On some android devices, it is necessary to stop the previous track*/
	        this.localStream.getTracks().forEach(t => t.stop());
      	}
      	if(this.platform.is('cordova')){
      		cordova.plugins.diagnostic.requestMicrophoneAuthorization( (status) => {

			   	if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
			       
			       cordova.plugins.diagnostic.requestCameraAuthorization({
					    
					    successCallback: (status) => {
					        console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
					        // if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
						        this.session
						        .getUserMedia(mediaParams)
							  	.then((localStream) => {
							  		this.localStream = localStream;
								  	console.log(this.localStream);
								  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
									    muted: true,
									    mirror: true,
								  	});
								  	let extension = {
								  		order: this.order,
								  		other_user: this.userDets,
								  		callToEnd: this.callToEnd
								  	};
									this.session.call(extension, (error) => {});
									this.setCallLog(this.userDets.id, 'init_call', new Date());
									// var data = {
									// 	type: 'incoming_call',
									// 	order_id: this.order.id
									// };
									// this.api.sendCallNotes(data)
									// .then(resp => {})
									// .catch(err => {});
							  	})
						  		.catch((error) => {
						  			console.log(error);
						  		});
					  		// }
					  		// else{
					  		// 	this.showVideoPermPop = 1;
					  		// }
					    },
					    errorCallback: function(error){
					        console.error(error);
					    },
					    externalStorage: false
					});
			   	}
			   	else{
			   		this.showAudioPermPop = 1;
			   	}
			}, (error) => {
			    console.error(error);
			});
		}
		else{
			this.session
		  	.getUserMedia(mediaParams)
		  	.then((localStream) => {
		  		this.localStream = localStream;
			  	console.log(this.localStream);
			  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
				    muted: true,
				    mirror: true,
			  	});
			  	let extension = {
			  		order: this.order,
			  		other_user: this.userDets,
			  		callToEnd: this.callToEnd
			  	};
				this.session.call(extension, (error) => {});
				this.setCallLog(this.userDets.id, 'init_call', new Date());
				// var data = {
				// 	type: 'incoming_call',
				// 	order_id: this.order.id
				// };
				// this.api.sendCallNotes(data)
				// .then(resp => {})
				// .catch(err => {});
		  	})
	  		.catch((error) => {
	  			console.log(error);
	  		});
		}
	}

	acceptCallCallback(){
		this.overlayMsg = "";
		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
		else{
			// setTimeout(() => {
			
			// }, 2000);
		}
		cordova.plugins.notification.local.cancelAll();
		var count = 1;
		setTimeout(() => {

			cordova.plugins.notification.local.schedule({
				id: 1,
			    title: this.other_user.name,
			    text: "Ongoing Video Call via Samanta",
	            foreground: true,
			    ongoing: true,
			    smallIcon: 'res://ic_stat_onesignal_call',
			    priority: 1,
		    	channel: 'call_channel_ongoing',
			    actions: [
			        { id: 'end_call', title: 'End Call' }
			    ]
			});
			// // updateInterval: function () {
			var minutes:any = 0;
			var seconds:any = 0;
			var minutes_disp = "";
			var seconds_disp = "";
			var time_text = "";
	        // this.noteInt = setInterval(() => {
	        // 	count++;
	        // 	seconds = Math.floor(count % 60);
			// 	minutes = Math.floor(count/60);

			// 	console.log(minutes+":"+seconds);


			// 	if(minutes < 10){
			// 		minutes_disp = "0"+minutes;
			// 	}else{
			// 		minutes_disp = minutes;
			// 	}

			// 	if(seconds < 10){
			// 		seconds_disp = "0"+seconds;
			// 	}else{
			// 		seconds_disp = seconds;
			// 	}

			// 	time_text = minutes_disp+":"+seconds_disp;

			// 	cordova.plugins.notification.local.update({
		    //         id: 1,
		    //         // title: 'Updated Message 1',
		    //         text: "Ongoing Video calls via Samanta\n"+time_text
		    //     });
			// },1000);
		},1000);
	}
	endCallCallback(flag, flag1 = 0){
		this.resetAllToDefault();
		if(this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
		else{
			if(flag1 == 0){
				cordova.plugins.CordovaCall.endCall();
			}
		}
		cordova.plugins.notification.local.cancelAll();
		if(this.session){
			let extension = {};
			this.session.stop(extension);
			this.session = null;
		}

		this.misc.showToast('Call Ended.');

		if(flag == 0){
			this.setCallLog( this.userDets.id, 'disconnected', new Date() );
		}
		else{
			this.setCallLog( this.other_user.id, 'no_answer', new Date() );
		}
		this.on_call = 0;
		this.outgoing = 0;
		this.incoming = 0;
		clearInterval(this.timeInt);
		this._ngZone.run(() => {
			this.router.navigate(['/summary/'+this.order.id]);
		});

	}

	async acceptCall(){

		// if(this.connected == 0 || this.incoming == 0 || this.session.ID == undefined){
		// 	// if(this.inc_count < 10){
		// 		setTimeout(() => {
		// 			this.acceptCall();
		// 		}, 1000);
		// 		// this.inc_count++;
		// 		return;
		// 	// }
		// 	// else{
		// 		// this.endCall();
		// 	// }
		// }

		console.log('session_id:', this.session.ID);
		this.callStartTime = new Date();
		
		// cordova.plugins.CordovaCall.connectCall();
		this.overlayMsg = "";

		this.incoming = 0;
		this.on_call = 1;

		if(this.platform.is('ios')){
			cordova.plugins.CordovaCall.endCall();
		}

		// if(this.localStream){
		// 		this.localStream.getTracks().forEach(track => track.stop());
		// }

		setTimeout(() => {
			this.platform.ready().then(() => {
				let mediaParams = {
				  audio: true,
				  video: true
				  // video: {
				  // 	aspectRatio: 9/16
				  // }
				  // video: { height: { min: 800, max: 800 }, width:  { min: 360, max: 360 } }
				};

				if(this.platform.is('cordova')){
					cordova.plugins.diagnostic.requestMicrophoneAuthorization( (status) => {

				   		if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){

					  		cordova.plugins.diagnostic.requestCameraAuthorization({
							    successCallback: (status) => {
							        console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
				   					// if(status == cordova.plugins.diagnostic.permissionStatus.GRANTED){

										this.session
									  	.getUserMedia(mediaParams)
									  	.then(localStream => {
									  		this.localStream = localStream;
										  	console.log(this.localStream);
										  	// try{
											  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
												    muted: true,
												    mirror: true,
											  	});
										  	// }
										  	// catch(err){
										  		// console.log(err);
										  	// }
										  	let extension = {};
										  	if(this.platform.is('ios')){
										  		cordova.plugins.iosrtc.refreshVideos();
									  		}
											this.session.accept(extension, (error) => {});
											// this.resetVideoStream();
											this.acceptCallCallback();
											this.setCallLog(this.userDets.id, 'received', new Date());
											// this.incoming = 0;
											// this.on_call = 1;
									  	})
								  		.catch((error) => {
								  			console.log(error);
								  		});
							  		// }
							  		// else{
							  		// 	this.showVideoPermPop = 1;
							  		// }
						  		}
					  		});
				  		}
				  		else{
				  			this.showAudioPermPop = 1;
				  		}
			  		});
		  		}
		  		else{
		  			this.session
				  	.getUserMedia(mediaParams)
				  	.then((localStream) => {

				  		this.localStream = localStream;
					  	console.log(this.localStream);
					  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
						    muted: true,
						    mirror: true,
					  	});
					  	let extension = {};
					  	if(this.platform.is('ios')){
					  		cordova.plugins.iosrtc.refreshVideos();
				  		}
						this.session.accept(extension, (error) => {});
						this.acceptCallCallback();
						this.setCallLog(this.userDets.id, 'received', new Date());

				  	})
			  		.catch((error) => {
			  			console.log(error);
			  		});
		  		}
	  		});

		}, 100);
	}

	flipAudio(){
		console.log('Audio flipped');
		if(this.audio_out_mode == 0){
			AudioToggle.setAudioMode(AudioToggle.EARPIECE);
			this.audio_out_mode = 1;
		}
		else{
			this.audio_out_mode = 0;
			AudioToggle.setAudioMode(AudioToggle.SPEAKER);
		}
	}

	resetVideoStream(){
		if(this.localStream){
  			this.localStream.getTracks().forEach(track => track.stop());
		}
		this.localStream = null;
		let constraints = { audio:true, video: true };
		this.session
	  	.switchMediaTracks(constraints)
	  	.then((stream) => {
	  		this.localStream = stream;
	  		this.session.attachMediaStream("myVideoElementId", stream, {
			    muted: true,
			    mirror: true,
		  	});
	  		cordova.plugins.iosrtc.refreshVideos();
	  	})
	  	.catch((error) => {
	  		console.log(error);
	  	});
	}

	flipCamera(){
		if(this.localStream){
  			this.localStream.getTracks().forEach(track => track.stop());
		}
		this.localStream = null;
		// this.localStream.getTracks().forEach(track => track.stop());
		if(this.activeCamera == 0){
			this.activeCamera = 1;
			let constraints = { video: { facingMode: { ideal: "environment" } }, audio: true };
			this.session.mediaParams.elementId = 'myVideoElementId';
			this.session
		  	.switchMediaTracks(constraints)
		  	.then((stream) => {
		  		this.localStream = stream;
				if(this.audio_muted == 1){
					this.session.mute("audio");
				}
				else{
					this.session.unmute("audio");
				}
		  		// this.session.attachMediaStream("myVideoElementId", stream, {
				//     muted: true,
				//     mirror: true,
			  	// });
		  		// cordova.plugins.iosrtc.refreshVideos();
		  	})
		  	.catch((error) => {
		  		console.log(error);
		  	});
		}
		else{
			let constraints = { video: { facingMode: { ideal: "user" } }, audio: true };
	  		this.activeCamera = 0;
			this.session.mediaParams.elementId = 'myVideoElementId';
			this.session
		  	.switchMediaTracks(constraints)
		  	.then((stream) => {
		  		this.localStream = stream;
				if(this.audio_muted == 1){
					this.session.mute("audio");
				}
				else{
					this.session.unmute("audio");
				}
		  		// this.session.attachMediaStream("myVideoElementId", stream, {
				//     muted: true,
				//     mirror: true,
			  	// });
		  		// cordova.plugins.iosrtc.refreshVideos();
		  	})
		  	.catch((error) => {
		  		console.log(error);
		  	});
		}
	}

	async rejectCallBack(data){
		// console.log(data);
		if(this.connected == 0){
			setTimeout(() => {
				this.rejectCallBack(data);
			}, 1000);
			return;
		}

		this.overlayMsg = "";

		let params = { 
		  	sessionID: data.session_id, 
		  	recipientId: data.recipient_id, 
		  	platform: 'web'
		};

		await ConnectyCube.videochat.callRejectRequest(params);
		this.overlayMsg = "";
		this.order.id = data.order_id;
		this.setCallLog(this.userDets.id, 'declined', new Date());
		this.incoming = 0;
		this.on_call = 0;
		this.reject_request = 1;
		setTimeout(() => {
			this.reject_request = 0;
		}, 3000);
		this._ngZone.run(() => {
			this.router.navigate(['/summary/'+this.order.id]);
		});
	}

	rejectCall(){
		if(this.connected == 0 || this.incoming == 0){
			// if(this.inc_count_reject < 10){
				setTimeout(() => {
					this.rejectCall();
				}, 1000);
				// this.inc_count_reject++;
				return;
			// }
			// else{
				// this.endCall();
			// }
		}
		// if(this.connected == 0 || this.incoming == 0){

		// 	setTimeout(() => {
		// 		this.rejectCall();
		// 	}, 1000);
		// 	return;
		// }

		this.overlayMsg = "";

		let extension = {};
		this.session.reject(extension);
		this.rejectAction();
	}

	async endCall(flag=0, flag1=0){
		await this.resetAllToDefault();
		this.endCallCallback(flag, flag1);
	}

	shareScreen(){
		let constraints = {
		  video: true,
		  audio: true,
		};

		this.session.mediaParams.elementId = 'myVideoElementId';

		this.session.getDisplayMedia(constraints, true)
	  	.then((localDesktopStream) => {
	  		
	  	})
	  	.catch((error) => {
	  		console.log(error);
	  	});
	}

	muteVideo(){
		this.session.mute("video");
		this.video_muted = 1;
		var call_message = {
			'type': 'video_muted',
			'value': this.video_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));

	}

	unmuteVideo(){
		this.session.unmute("video");
		this.video_muted = 0;
		var call_message = {
			'type': 'video_muted',
			'value': this.video_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
	}

	muteAudio(){
		this.session.mute("audio");
		this.audio_muted = 1;
		var call_message = {
			'type': 'audio_muted',
			'value': this.audio_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
	}

	unmuteAudio(){
		this.session.unmute("audio");
		this.audio_muted = 0;
		var call_message = {
			'type': 'audio_muted',
			'value': this.audio_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
	}

	async switchVideo(){
		console.log(this.video_device_selected);
		
		// let tracks = this.localStream.getTracks();
		// tracks.forEach(track => track.stop());

		// let mediaParams = {};
		// Provide new options
		// this.localStream = await navigator.mediaDevices.getUserMedia(mediaParams);

		// this.session
  		// .getUserMedia(mediaParams)
	  	// .then((localStream) => {
	  	// 	this.localStream = localStream;
	  	// 	this.session.attachMediaStream("myVideoElementId", this.localStream, {
		// 	    muted: true,
		// 	    mirror: true,
		//   	});

	  	// })
	  	// .catch((error) => {});
		// Add this stream to the video object
		// videoElm.srcObject = null;
		// videoElm.srcObject = stream;
		// videoElm.play();
		// return;

		// let constraints = { video: this.video_device_selected };
	  	// return;

		let constraints = { video: { facingMode: { exact: "environment" } } };
		this.session.mediaParams.elementId = 'myVideoElementId';
		this.session
	  	.switchMediaTracks(constraints)
	  	.then((stream) => {
	  		// this.session.attachMediaStream("myVideoElementId", stream, {
			//     muted: true,
			//     mirror: true,
		  	// });
	  		// cordova.plugins.iosrtc.refreshVideos();
	  	})
	  	.catch((error) => {
	  		console.log(error);
	  	});
	}

	switchAudio(){
		// alert(this.audio_device_selected);
		let constraints = { audio: this.audio_device_selected };
		this.session.mediaParams.elementId = 'myVideoElementId'
		this.session
	  	.switchMediaTracks(constraints)
	  	.then((stream) => {
	  		// this.session.attachMediaStream("myVideoElementId", stream, {
			//     muted: true,
			//     mirror: true,
		  	// });
	  		// cordova.plugins.iosrtc.refreshVideos();
	  	})
	  	.catch((error) => {
	  		console.log(error);
	  	});
	}





	getRemainingTime(){
		// this.refreshVideos();	
		var endTime = new Date((this.order.to_time+" UTC").replace(/-/g, '/'));
		var total = endTime.getTime() - new Date().getTime();
		
		var timeNow = new Date().getTime() - this.callStartTime.getTime();
		var time_passed = timeNow/1000;
		// if(time_passed > 60){
		// 	this.showCancel = 0;
		// }
		// else{
		// 	this.showCancel = 1;
		// }

		if(total < 0 && this.callExtended == 0){
			clearInterval(this.timeInt);
			if(!(this.userDets.user_type == 3)){
				this.endCall();
				return;
			}
		}
		else{
			if(!(this.callToEnd == null)){
				if(((new Date()).toISOString()) >= this.callToEnd){
					clearInterval(this.timeInt);
					if(!(this.userDets.user_type == 3)){
						this.endCall();
					}
				}
			}
			if(total < 0){
				var rem_text = "Extra Time";
				total = (new Date().getTime()) - (endTime.getTime());
			}
			else{
				var rem_text = "Remaining time";
			}
			var seconds:any = Math.floor( (total/1000) % 60 );
			var minutes:any = Math.floor( (total/1000/60) % 60 );
			var totalMinutes:any = Math.floor((total/1000/60));
			
			// console.log(this.on_call+'===='+minutes+'====='+this.order.user_id+'====='+this.userDets.id+'====='+this.callExtendShown);

			if((minutes < 2) && (this.order.user_id == this.userDets.id) && (this.callExtendShown == 0)){
				// alert('extension');
				this.callExtendRequest = 1;
			}
			
			if(minutes < 0){
			
				minutes = -(minutes);
			
			}
			if(seconds < 0){
			
				seconds = -(seconds);
			
			}

			if(minutes < 10){
				minutes = "0"+minutes;
			}

			if(seconds < 10){
				seconds = "0"+seconds;
			}

			this.rem_text = rem_text;
			this.minutes = minutes;
			this.seconds = seconds;
			
			document.querySelector('#remText').innerHTML = ""+rem_text;
			document.querySelector('#remMin').innerHTML = ""+minutes;
			document.querySelector('#remSec').innerHTML = ""+seconds;
			document.querySelector('#remText1').innerHTML = ""+rem_text;
			document.querySelector('#remMin1').innerHTML = ""+minutes;
			document.querySelector('#remSec1').innerHTML = ""+seconds;
			document.querySelector('#remText2').innerHTML = ""+rem_text;
			document.querySelector('#remMin2').innerHTML = ""+minutes;
			document.querySelector('#remSec2').innerHTML = ""+seconds;

		}
	}

	extend(val){
		this.callExtendRequest = 0;
		this.callExtendShown = 1;
		if(val == 0){
			this.callExtended = 0;
		}
		else{

			var call_message = {
				'type': 'extension_requested'
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
			
		}
	}


	extendAllow(val){
		this.callExtendRequested = 0;
		if(val == 0){
			this.callExtended = 0;

			var call_message = {
				'type': 'extension_denied'
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
		else{
			this.callExtended = 1;

			var call_message = {
				'type': 'extension_allowed'
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
	}


	sendCallMsgs(id, message){
		console.log(id);
		let sendRef = this.db.object('user'+id);
		sendRef.set(message);

	}

	receiveMessage(){
		// console.log(this.userDets.id);
		// this.prev_conn_val = true;
		this.db.object(".info/connected")
		.snapshotChanges()
		.subscribe(action => {
			console.log('fbconnnn',this.prev_conn_val+'-------'+action.payload.val());
			if(this.prev_conn_val == false && action.payload.val() == true){
				console.log('init firebase');
				this.prev_conn_val = action.payload.val();
				setTimeout(() => {
					this.receiveMessage();
					return;
				}, 2000);
			}
			else{
				this.prev_conn_val = action.payload.val();
			}
		});
		if((!(this.userDets == null)) && (!(this.userDets == undefined)) && (!(this.userDets.id == undefined)) ){
			if(this.noteRefSub){
				this.noteRefSub.unsubscribe();
			}
			this.noteRef = this.db.object('user'+this.userDets.id);
			this.noteRefSub = this.noteRef.snapshotChanges().subscribe(action => {
				console.log(action.payload.val());
				if(!(action.payload.val() == null) && (!(action.payload.val() == ""))){
					var message = JSON.parse(action.payload.val());
					this.sendCallMsgs(this.userDets.id, "");

					if(message.type == "order_accepted"){
				    	if(!(this.firebase.UserAcceptFn == undefined)){
				    		this.firebase.UserAcceptFn();
				    	}
				    	if(!(this.firebase.UserWaitFn == undefined)){
				    		this.firebase.UserWaitFn(message.order)
			    		}
				    }
				    
				    if(message.type == "order_requested"){
				    	if(!(this.firebase.UserAcceptFn == undefined)){
				    		this.firebase.UserAcceptFn();
			    		}
				    	this.showAcceptToast(message.order)
				    }

	    			if(message.type == "extension_requested"){
						this.callExtendRequested = 1;
					}

					if(message.type == "ringing"){
						this._ngZone.run(()=>{
							this.ringing = 1;
						});
					}

					// get extention offer accepted from service provider. 
					if(message.type == "extension_allowed"){
						this.callExtended = 1;
						this.misc.showToast('Service provider allowed extension of call.');
					}
					// get extension offer declined from service provider.
					if(message.type == "extension_denied"){
						this.callExtended = 0;
						this.misc.showToast('Service provider denied extension of call.');
					}
					
				    if(message.type == "audio_muted"){
				    	this.remote_audio_muted = message.value;
				    }

				    if(message.type == "video_muted"){
				    	this.remote_video_muted = message.value;
				    }
				}
			});
		}
	}


	showAcceptToast(order){
		var data = order;
		data['date'] = (new Date((data['date']+" UTC").replace(/-/g, '/'))).toISOString();
		this.bookingRequest = data;
	}

	getPopupEvents(){
		this.api.getPopupEvents()
		.then(resp => {
			if(resp.data.ongoing == null){
				if(resp.data.request == null){

				}
				else{
					// alert('You have a new request now');
					var data = resp.data.request;
					// data['date'] = (new Date((data['date']+" UTC").replace(/-/g, '/'))).toISOString();
					this.showAcceptToast(data);
					// this.bookingRequest = data;
				
				}
			}
			else{
				// alert('You have an ongoing call now');
				var data = resp.data.ongoing;
				data['date'] = (new Date((data['date']+" UTC").replace(/-/g, '/'))).toISOString();
				this.ongoingCall = data;
			}
		})
		.catch(err => {

		});
	}

	acceptOrder(order_id, status){
		var data = {
			'order_id': order_id,
			'status' : status
		};
		this.misc.showLoader();
		this.api.acceptOrder(data)
		.then(resp => {
			var order_date = new Date((resp.data.order.date + " UTC").replace(/-/g, "/"));
          	// if(status == 1){
				// var trigger_time = new Date(new Date(order_date).getTime() - 300000);  
				// console.log(trigger_time);
				// this.localNotifications.schedule({
				//    	title: "Upcoming order.",
				//    	text: 'Thank you for using Samanta. Your client booking begins in five minutes. Please be online and prepared for the appointment.',
				//    	trigger: {at: trigger_time},
				//    	led: 'FF0000',
				//    	sound: null
				// });
			// }

			this.bookingRequest = "";

			this.misc.hideLoader();
			// alert('accepted');
			var message = {
				'type': 'order_accepted',
				'order': resp.data.order
			};
			this.sendCallMsgs(resp.data.order.user_id, JSON.stringify(message));
			this._ngZone.run(() => {
				this.firebase.UserAcceptFn();
  			});
		})
		.catch(err => {

		});
	}

	setCallLog(user_id, action, time){

		if(!(action == "init_call")){
			setTimeout( ()=> {
				var data = {
					'user_id': user_id,
					'action': action,
					'time': time,
					'order_id': this.order.id
				};
				this.api.sendCallLog(data)
				.then(resp => {

				})
				.catch(err => {

				});
			}, 100);
		}
		else{
			var data = {
				'user_id': user_id,
				'action': action,
				'time': time,
				'order_id': this.order.id,
				'session_id': this.session.ID
			};
			this.api.sendCallLog(data)
			.then(resp => {
				// console.log(resp);
			})
			.catch(err => {

			});
		}
	}

	switchToSettings(){
		// alert('open permission settings');
		cordova.plugins.diagnostic.switchToSettings((status) => {

		}
		, (error) => {

		});
		this.showAudioPermPop = 0;
		this.showVideoPermPop = 0;
	}

	getChatData(){
		// this.userDets = this.misc.getUserDets();
		this.chatMsgs = [];
		this.itemRef = this.db.object('chat'+this.order.id);
		this.itemRefSub = this.itemRef.snapshotChanges().subscribe(action => {
			if(!(action.payload.val() == null)){
				this.chatMsgs = action.payload.val();
				if(!(this.chatMsgs == "")){
					this.chatMsgs = JSON.parse(this.chatMsgs);
				}
				else{
					this.chatMsgs = [];
				}
				if(this.chatWin == 0){
					this.newChat = 1;
				}
			}
		});
	}

	sendMsg(){
		if(this.message == ""){
			this.misc.showToast('Please enter a message.');
			return;
		}

		var data = {
			"message": this.message,
			"from": this.userDets.id
		};

		this.chatMsgs.push(data);

		var apidata = JSON.stringify(this.chatMsgs);
		const sendRef = this.db.object('chat'+this.order.id);
		sendRef.set(apidata);
		this.message = "";
	}

	callDestroy(){
		// alert('sdsdsa');
		// ConnectyCube.chat.disconnect();
		this._ngZone.run(() => {
			this.userLoggedIn = 0;
			if(this.timeInt){
				clearInterval(this.timeInt);
			}
			if(this.noteInt){
				clearInterval(this.noteInt);
			}
			this.userDets = null;
			this.lastUser = null;
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('user');
			ConnectyCube.logout().catch((error) => {});
          	axios.defaults.headers.common['Authorization'] = 'Bearer ';
			this.router.navigate(['/login']);
			// ConnectyCube.destroySession().catch((error) => {});
		});
	}




}