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
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
declare let cordova:any;
declare let ConnectyCube:any;
// require('connectycube/lib/videocalling/cubeWebRTCConstants').PeerConnectionState;

@Component({
	selector: 'app-caller',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {

	activeScreen:any = 1;
	userDets:any = {};
	session:any;
	order:any = {};
	other_user:any = {};
	incoming:any = 0;
	on_call:any = 0;
	outgoing:any = 0;
	videoDevices:any = [];
	audioDevices:any = [];
	audioOutDevices:any = [];
	video_muted:any = 0;
	audio_muted:any = 0;
	connected:any = 0;
	appOpen:any = 0;
	// cordovaCall:any;
	reject_request:any = 0;
	showDevicesList:any = 0;
	video_device_selected:any = "";
	audio_device_selected:any = "";
	localStream:any;
	timeInt:any;
	noteInt:any;
	showTopPerm:any = 0;
	callStartTime:any;
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
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
	bookingRequest:any = "";
	ongoingCall:any = "";
	showVideoPermPop:any=0;
	showAudioPermPop:any=0;
	constructor(
		private call:CallService,
		private misc:MiscService,
		private api:ApiService,
		private firebase:FirebaseService,
		private router:Router,
		private firebasex: FirebaseX,
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

		const CREDENTIALS = {
		  	appId: 6798,
		  	authKey: "KbVKtzAQvPFAdtw",
		  	authSecret: "zrXRtdLamjF7fmq"
		};

		const CONFIG = {
			videochat: {
			    answerTimeInterval: 60,
			    dialingTimeInterval: 2
		    },
		  	debug: { mode: 0 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
		};

		ConnectyCube.init(CREDENTIALS, CONFIG);

		this.platform.resume.subscribe(() => {      
    	 	console.log('****APP RESUMED**** => log start time');
    	 	// alert('ssdsd');
    	 	setTimeout(() => {
    	 		this.checkTopPerm();
    	 	}, 1000);
	 	});

		this.router.events.forEach((event) => {
			// console.log('sdfsdf');
	      	if(event instanceof NavigationEnd) {

				console.log('nav end');
				this.checkTopPerm();
				this.getPopupEvents();
				var last_user = this.userDets;
				this.userDets = this.misc.getUserDets();
				console.log('user1', last_user);
				console.log('user2', this.userDets);
				if((!(this.userDets == undefined))){
					this.userLoggedIn = 1;
					if(last_user == undefined || (!(last_user.id == this.userDets.id))){

		        		this.initCallService();
		        		this.receiveMessage();
		        		this.OneSignalInit();
					}
				}
        	}
    	});
		// this.call.initDestroy(this.callDestroy.bind(this));

	}

	checkTopPerm(){
		this.platform.ready().then(() => {
			// alert('dfsdfs');
			cordova.plugins.backgroundMode.getForegroundPermissionStatus(res => {
				// console.log(res);
				this._ngZone.run(() => {
					if(res == false){
						this.showTopPerm = 1;
					}
					else{
						this.showTopPerm = 0;
					}
				});
			});
		});
	}

	openTopPermission(){
		cordova.plugins.backgroundMode.requestForegroundPermission();
	}

	OneSignalInit(){

		this.platform.ready().then(() => {

			if(this.platform.is('cordova')){
				// OneSignal.removeExternalUserId();
			// }
			// let externalUserId = 'samnote'+this.userDets.id;

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
			      		this.acceptCall();
			      		if(this.appOpen == 0){
			      			this.overlayMsg = "Accepting Call. Please Wait..";
		      			}
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


				OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {
					this.appOpen = 1;
					var data = notificationReceivedEvent.notification.additionalData;
					console.log(notificationReceivedEvent.notification);
					if(!(data == undefined)){
						if(data.type == 'incoming_call'){
							notificationReceivedEvent.complete(notificationReceivedEvent.notification);
						}
						else{
							notificationReceivedEvent.complete(notificationReceivedEvent.notification);
						}
					}
					else{
						notificationReceivedEvent.complete(notificationReceivedEvent.notification);
					}
					
					// this.receiveMessages(notificationReceivedEvent.notification.additionalData);
				});
			}
		});
	}


	initCallService(){
		this.platform.ready().then(() => {

	    	this.listenEvents();

	    	const userCredentials = {
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
		  	
			// this.cordovaCall = cordova.plugins.CordovaCall;

			// this.userDets = this.misc.getUserDets();

			// ConnectyCube.createSession()
		  	// .then((session) => {
		  	// 	const userProfile = {
			// 	  	password: "supersecurepwd",
			// 	  	email: this.userDets.email
			// 	};

				// ConnectyCube.login(userProfile)
			  	// .then((user) => {
			  	// 	console.log('ConnCube',user);
			  	// 	this.ConnectyCubeUser = user;
			  	// })
			  	// .catch((error) => {

			  	// });
		  	// })
		  	// .catch((error) => {});
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
		this.platform.ready().then( () => {
			if (this.platform.is('cordova')) {
				cordova.plugins.backgroundMode.wakeUp();
				cordova.plugins.backgroundMode.unlock();
				cordova.plugins.backgroundMode.moveToForeground();
			}
		});
	}

	sendAppToBackground(){
		this.platform.ready().then( () => {
			if (this.platform.is('cordova')) {
				// cordova.plugins.backgroundMode.wakeUp();
				// cordova.plugins.backgroundMode.unlock();
				cordova.plugins.backgroundMode.moveToBackground();
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
  		
  		// cordovaCall.on('answer', (e) => {
  		// 	cordovaCall.connectCall();
  		// 	this.bringAppToForeground();
  		// 	this.acceptCall();
  		// 	// alert('call answered');
  		// });

		// ConnectyCube.videochat
	  	// .getMediaDevices("videoinput")
	  	// .then((devices) => {
		//     if (devices.length) {
		//     	this.videoDevices = devices;
		//       	console.log(devices);
		//     }
		//     ConnectyCube.videochat
		//   	.getMediaDevices("audioinput")
		//   	.then((devices) => {
		// 	    if (devices.length) {
		// 	    	this.audioDevices = devices;
		// 	      	console.log(devices);
		// 	    }
		//   	})
		//   	.catch((error) => {
		//   		console.log('eer');
		//   	});
	  	// })
	  	// .catch((error) => {
	  	// 	console.log('eer2');
	  	// });

		// alert('listening');

	  	ConnectyCube.videochat.onUserNotAnswerListener = (session, userId) => {
	  		if(this.userLoggedIn == 1){
		  		// alert('not answered');
		  		this.misc.showToast("Call not answered by user");
		  		this.endCall(1);
	  		}
	  	};


		ConnectyCube.videochat.onCallListener =  (session, extension) => {
			console.log('callListenerActive');
		  	if(this.userLoggedIn == 1){
				console.log('callListenerActive2');

		  		this.session = session;
			  	// alert('incoming');

			  	this.overlayMsg = "";

			  	console.log(this.outgoing+"======"+this.reject_request);
			  	
			  	if(this.outgoing == 0 && this.reject_request == 0){
			  		console.log('call received');
			  		this.showIncomingActivity(extension);

			  		// cordovaCall.receiveCall('David Marcus via Samanta',(e) => {
					// 	console.log('sfsadas', e);
					// },
					// (err) => {
					// 	console.log(err);
					// });
		  		}
	  		}
		};

		ConnectyCube.videochat.onRemoteStreamListener = (session, userID, remoteStream) => {
		  	if(this.userLoggedIn == 1){
		  		// attach the remote stream to DOM element
			  	session.attachMediaStream("remoteVideoElementId", remoteStream);
				this.callStartTime = new Date().toISOString();
				this._ngZone.run(() => {
					this.timeInt = setInterval(()=>{
						this.getRemainingTime();
					}, 1000);
				});
			}
		};

		ConnectyCube.videochat.onAcceptCallListener = (session, userId, extension) => {
			console.log('call accepted succesfully');
			this.outgoing = 0;
			this.on_call = 1;
			this.acceptCallCallback();
		};

		ConnectyCube.videochat.onRejectCallListener = (session, userId, extension) => {
			this.outgoing = 0;
			this.on_call = 0;
			this.rejectCallCallBack();
			this._ngZone.run(() => {
				this.router.navigate(['/summary/'+this.order.id]);
			});
		};

		ConnectyCube.videochat.onStopCallListener = async (session, userId, extension) => {
			await this.resetAllToDefault();
			if(this.userLoggedIn == 1){
		  		this.stopCallCallBack();
			}
		};

  		this.connected = 1;

	}

	showIncomingActivity(extension){
  		this.order = extension.order;
  		this.other_user = extension.other_user;
  		this.callToEnd = extension.callToEnd;
		this.bringAppToForeground();
		this._ngZone.run(() => {
			this.incoming = 1;
  		});
		cordova.plugins.RingtonePlayer.play();
		// =================
		// Show Notification
		// =================
		this.showIncomingNotification();
	}

	showIncomingNotification(){
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

	rejectCallCallBack(){
		cordova.plugins.RingtonePlayer.stop();
	}


	stopCallCallBack(){
		cordova.plugins.RingtonePlayer.stop();
		this.outgoing = 0;
		this.incoming = 0;
		this.on_call = 0;
		cordova.plugins.notification.local.cancelAll();
		clearInterval(this.timeInt);
		this._ngZone.run(() => {
			this.router.navigate(['/summary/'+this.order.id]);
		});
	}

	rejectAction(){
		cordova.plugins.RingtonePlayer.stop();
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




	ngAfterViewInit() {

	}

	callUser(id, order_id){
		this.ongoingCall = "";
	    this.call.call(id, order_id);
  	}

  	resetAllToDefault(){
  		this.incoming = 0;
  		this.outgoing = 0;
  		this.on_call = 0;
  		this.audio_muted = 0;
  		this.video_muted = 0;
  		this.remote_video_muted = 0;
  		this.remote_audio_muted = 0;
  		this.showDevicesList = 0;
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
  	}

	async callInit(order_id){
		if(this.connected == 0){
			setTimeout(() => {
				this.callInit(order_id);
			}, 1000);
			return;
		}
		setTimeout(() => {
	    	this.router.navigate(['/']);
	    }, 2000);

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
    		console.log(err);
    	});

	}


	async startCall(){
		const calleesIds = [this.other_user.calling_id]; // User's ids
		const sessionType = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
		const additionalOptions = {};
		this.session = ConnectyCube.videochat.createNewSession(calleesIds, sessionType, additionalOptions);
		console.log(this.session.ID);
		const mediaParams = {
		  audio: true,
		  video: true
		  // video: {
		  // 	aspectRatio: 9/16
		  // }
		};

		this.outgoing = 1;
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
					        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
						        this.session
						        .getUserMedia(mediaParams)
							  	.then((localStream) => {
							  		this.localStream = localStream;
								  	console.log(this.localStream);
								  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
									    muted: true,
									    mirror: true,
								  	});
								  	const extension = {
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
					  		else{
					  			this.showVideoPermPop = 1;
					  		}
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
			  	const extension = {
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
		cordova.plugins.RingtonePlayer.stop();
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
	        this.noteInt = setInterval(() => {
	        	count++;
	        	seconds = Math.floor(count % 60);
				minutes = Math.floor(count/60);

				console.log(minutes+":"+seconds);


				if(minutes < 10){
					minutes_disp = "0"+minutes;
				}else{
					minutes_disp = minutes;
				}

				if(seconds < 10){
					seconds_disp = "0"+seconds;
				}else{
					seconds_disp = seconds;
				}

				time_text = minutes_disp+":"+seconds_disp;

				cordova.plugins.notification.local.update({
		            id: 1,
		            // title: 'Updated Message 1',
		            text: "Ongoing Video calls via Samanta\n"+time_text
		        });
			},1000);
		},1000);
	}
	endCallCallback(flag){
		cordova.plugins.RingtonePlayer.stop();
		cordova.plugins.notification.local.cancelAll();
		if(this.session){
			const extension = {};
			this.session.stop(extension);
		}
		if(flag == 0){
			this.setCallLog(this.userDets.id, 'disconnected', new Date());
		}
		else{
			this.setCallLog(this.other_user.id, 'no_answer', new Date());
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

		if(this.connected == 0 || this.incoming == 0){
			setTimeout(() => {
				this.acceptCall();
			}, 1000);
			return;
		}
		this.overlayMsg = "";
		this.acceptCallCallback();

		this.platform.ready().then(() => {
			const mediaParams = {
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
			   					if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){

									this.session
								  	.getUserMedia(mediaParams)
								  	.then((localStream) => {
								  		this.localStream = localStream;
									  	console.log(this.localStream);
									  	this.session.attachMediaStream("myVideoElementId", this.localStream, {
										    muted: true,
										    mirror: true,
									  	});
									  	const extension = {};
										this.session.accept(extension, (error) => {});
										this.setCallLog(this.userDets.id, 'received', new Date());
										this.incoming = 0;
										this.on_call = 1;
								  	})
							  		.catch((error) => {});
						  		}
						  		else{
						  			this.showVideoPermPop = 1;
						  		}
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
				  	const extension = {};
					this.session.accept(extension, (error) => {});
					this.incoming = 0;
					this.on_call = 1;
			  	})
		  		.catch((error) => {});
	  		}
  		});
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

		const params = { 
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
		if(this.connected == 0){
			setTimeout(() => {
				this.rejectCall();
			}, 1000);
			return;
		}

		this.overlayMsg = "";

		const extension = {};
		this.session.reject(extension);
		this.rejectAction();
	}

	async endCall(flag=0){
		await this.resetAllToDefault();
		this.endCallCallback(flag);
	}

	shareScreen(){
		const constraints = {
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
		
		// const tracks = this.localStream.getTracks();
		// tracks.forEach(track => track.stop());

		// const mediaParams = {};
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

		// const constraints = { video: this.video_device_selected };
	  	// return;

		const constraints = { video: { facingMode: { exact: "environment" } } };
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
		const constraints = { audio: this.audio_device_selected };
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
			
			console.log(this.on_call+'===='+minutes+'====='+this.order.user_id+'====='+this.userDets.id+'====='+this.callExtendShown);

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
		const sendRef = this.db.object('user'+id);
		sendRef.set(message);

	}

	receiveMessage(){
		// console.log(this.userDets.id);
		// this.db.object(".info/connected").snapshotChanges().subscribe(action => {
		// 	if(action.payload.val() == false){
		// 		console.log(action.payload.val());
		// 		setTimeout(() => {
		// 			this.receiveMessage();
		// 			return;
		// 		}, 2000);
		// 	}
		// });
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

	callDestroy(){
		// alert('sdsdsa');
		// ConnectyCube.chat.disconnect();
		this.userLoggedIn = 0;
		ConnectyCube.logout().catch((error) => {});
		ConnectyCube.destroySession().catch((error) => {});
	}




}