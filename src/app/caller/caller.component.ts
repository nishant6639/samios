import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';

import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import { FirebaseService } from '../services/firebase.service';
// import OneSignal from 'onesignal-cordova-plugin';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

declare let cordova:any;
declare let ConnectyCube;
declare let AudioToggle:any;
declare let VoIPPushNotification:any;

declare var require: any;
const axios = require('axios').default;

// const iOS = window.device?.platform === "iOS";
// const isMobile =
//   /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
//     navigator.userAgent || navigator.vendor || window.opera
//   ) ||
//   /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
//     (navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)
//   );


@Component({
	selector: 'app-caller',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {

	mediaParams:any = {
	    audio: true,
	    video: true
  	};
  	calleesIds:any = [];
  	incoming:any = 0;
  	on_call:any = 0;
	timeInt:any = null
  	dialing:any = 0;
  	video_loading:any = 0;
  	userDets:any = {};
  	callToEnd:any;
	noteRef:any;
	dialCallBck:any = null;
	noteRefSub:any;
	activeScreen:any = 0;
	prev_conn_val:any = true;
	cordovaCall:any;
  	connected:any = 0;
	connCallBck:any = null;
	showTopPerm:any = 0;
	internet:any = true;
	showAudioPermPop:any = 0;
	callExtendShown:any = 0;
	callExtendRequest:any = 0;
	ringing:any = 0;
	rem_text:any = "";
	minutes:any = "";
	seconds:any = "";
	chatMsgs:any = [];
	audio_muted:any = 0;
	showVideoPermPop:any = 0;
	overlayMsg:any = "";
	reconnecting:any = 0;
	video_muted:any = 0;
	callExtendRequested:any = 0;
	callExtended:any = 0;
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
	showVideoSelf:any = 1;
	connecting:any = 0;
	callStartTime:any;
	chatWin:any = 0;
	message:any="";
	itemRef:any;
	itemRefSub:any;
	newChat:any = 0;
  	$calling:any = document.getElementById("signal-in");
	$dialing:any = document.getElementById("signal-out");
	$endCall:any = document.getElementById("signal-end");

	$modal:any = document.getElementById("call-modal-icoming");

	$muteUnmuteButton:any = document.getElementById("videochat-mute-unmute");
	$switchCameraButton:any = document.getElementById("videochat-switch-camera");
	$switchSharingScreenButton:any = document.getElementById("videochat-sharing-screen");

	sharingScreenMediaParams:any = {
	    audio: true,
	    video: { frameRate: { ideal: 10, max: 15 } },
	    elementId: "localStream",
	    options: {
	      muted: true,
	      mirror: true,
	    },
  	};

	_session:any = null;
	resume:any = 0;
	mediaDevicesIds:any = [];
	activeDeviceId:any = null;
	isAudioMuted:any = false;
	isVideoMuted:any = false;
	isSharingScreen:any = false;
	startEventSharinScreen:any = null;
	order_id:any = 0;
	order:any = {};
	other_user:any = {};
	state:any = 'resumed';
	ongoingCall:any = "";
	bookingRequest:any = "";
	call_stopped:any = 0;
	chat_connected:any = 0;
	pltfrm:any;

  	constructor(
  		private misc:MiscService,
  		private call:CallService,
  		private api:ApiService,
  		private firebase:FirebaseService,
  		private router:Router,
  		private _ngZone:NgZone,
		private db: AngularFireDatabase,
  		// private firebasex: FirebaseX,
  		private platform:Platform
	) {
		this.pltfrm = platform;
		this.call.initCall(this.callInit.bind(this));
		this.call.initDestroy(this.callDestroy.bind(this));
		this.firebase.initSendCallMsg(this.sendCallMsgs.bind(this));
		this.platform.ready().then(() => {
			this.cordovaCall = cordova.plugins.CordovaCall;
			this.cordovaCall.setAppName('Samanta');
			this.cordovaCall.setVideo(true);
			
			// this.OneSignalInit();
			// if(this.platform.is('ios')){
				// cordova.plugins.iosrtc.registerGlobals();
			// }

			this.userDets = this.misc.getUserDets();

			this.router.events.forEach((event) => {
				// console.log('sdfsdf');
		      		if(event instanceof NavigationEnd) {

					console.log('nav end');

		        		this.getPopupEvents();

		      		}
		    	});
		});
  	}

  	// ngAfterViewInit() {
  		// alert('asdasd');
  	// }

  	ngAfterViewInit(){
  		this.platform.ready()
  		.then(() => {     
			this.checkTopPerm();
			this.platform.resume.subscribe(() => {     
				this.checkTopPerm();
				this.getPopupEvents();
			});
			if(this.platform.is('cordova')){
				this.OneSignalInit();
				this.voipInit();
			}
			this.initCallService();
			this.receiveMessage();
  			// if(this.platform.is('ios')){
  			// 	cordova.plugins.iosrtc.registerGlobals();
			// }
			// setTimeout(() => {
				// this.initCallService();
			// }, 2000);
  		})
  		.catch(err => {

  		});
  		// .then(() => {
  		// });
		// this.listenEvents();
  	}

	voipInit = async () => {
		if(this.platform.is('ios')){
			var push = await VoIPPushNotification.init();
		      	push.on('notification', (data) => {
			      console.log("[Ionicssssss] notification callback called");
			      console.log(parseInt(JSON.parse(data.extra).Caller.ConnectionId));
			      this.order_id = parseInt(JSON.parse(data.extra).Caller.ConnectionId);
			      console.log(data);
			});

			push.on('error', function(e) {
			      console.log(e);
			});
		}
	}

  	initCallService = () => {
		this.listenEvents();
  		// this.listenEvents();
  		// alert('sdas');
  		let CREDENTIALS = {
		  	appId: 6798,
		  	authKey: "KbVKtzAQvPFAdtw",
		  	authSecret: "zrXRtdLamjF7fmq"
		};

		let CONFIG = {
			chat: {

			},
			videochat: {
				alwaysRelayCalls:false,
				disconnectTimeInterval: 600
			},
		  	debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
		};

  		ConnectyCube.init(CREDENTIALS, CONFIG);

		let user = {
			password: "supersecurepwd",
			email: this.userDets.email
		};
		ConnectyCube.createSession(user)
		.then(() => {
			ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" })
			.then(() => {
				this.chat_connected = 1;
			});
		})
		.catch((err) => {

		});
  	};

	  reInitCallService = () => {
		return;
		console.log('reinitializing call service');
		this.chat_connected = 0;
		if(this.internet == false){
			setTimeout(() => {
				this.reInitCallService();
			}, 1000);
			return false;
		}
		// await ConnectyCube.chat.disconnect();
		// await ConnectyCube.logout().catch((error) => {});
		// await ConnectyCube.destroySession();

		let CREDENTIALS = {
			appId: 6798,
			authKey: "KbVKtzAQvPFAdtw",
			authSecret: "zrXRtdLamjF7fmq"
		};

		let CONFIG = {
			chat: {
				reconnectionTimeInterval: 0,
				reconnect: {
					enable: false,
				},
			},
			videochat: {
				alwaysRelayCalls:false,
				disconnectTimeInterval: 600
			},
				debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
		};

		ConnectyCube.init(CREDENTIALS, CONFIG);

		let user = {
			password: "supersecurepwd",
			email: this.userDets.email
		};
		ConnectyCube.createSession(user)
		.then(() => {
			ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" })
			.then(() => {
				this.listenEvents();
				this.chat_connected = 1;
				if(this.reconnecting == 1){
					this.chatAndCallReconnect();
				}
			});
		})
		.catch((err) => {

		});

  	};

	onDisconnectedListener = () => {
	};

	chatAndCallReconnect = () => {
		if(ConnectyCube.chat.isConnected == false){
			setTimeout(() => {
				this.chatAndCallReconnect();
			}, 1000);
			return false;
		}
		let extension1 = {};
		console.log('3');
		if(!(this._session == null)){
			this._session.stop(extension1);
		}
		let options= {};
		this._session = ConnectyCube.videochat.createNewSession(
			this.calleesIds,
			ConnectyCube.videochat.CallType.VIDEO,
			options
		);
		
		const video:any = document.getElementById("localStream");
		if(!(video.srcObject == undefined || video.srcObject == null)){
			for(const track of video.srcObject.getTracks()) {
				track.stop();
			}
	  	}
		const video_rem:any = document.getElementById("remoteStream");
		  if(!(video_rem.srcObject == undefined || video_rem.srcObject == null)){
		    for(const track of video_rem.srcObject.getTracks()) {
			track.stop();
		    }
	      	}


		this._session
		.getUserMedia(this.mediaParams)
		.then((stream) => {
			console.log('stream got');
			this._session.attachMediaStream("localStream", stream, {
				muted: true,
				mirror: true,
			});
			
			console.log('stream attached');

			let extension = {
				order: this.order,
				other_user: this.userDets,
				auto_accept: 1
			};

			this._session.call(extension, error => {
				console.log(error);
			});

			console.log('called');

			// this.setCallLog(this.userDets.id, 'init_call', new Date());

		})
		.catch((error) => {
			console.log(error);
		});
	}

  	logout = () => {
	    ConnectyCube.chat.disconnect();
	    ConnectyCube.destroySession();
  	};

  	OneSignalInit(){

  		// alert('push');
  		try{

		this.platform.ready().then(() => {

			if(this.platform.is('cordova')){
				
				this.misc.onesignal.setNotificationOpenedHandler((jsonData:any) => {
					console.log('notificationOpenedCallback: ', jsonData);
					let noteData = jsonData;
					let clickAction = "";
					
					if(this.platform.is('ios')){
						clickAction = noteData.action.actionID;
					}
					else{
						clickAction = noteData.action.actionId;
					}

					console.log('Clicked button: ' + clickAction);
					if(clickAction == 'accept'){
						// if(this.appOpen == 0){
						// 	this.overlayMsg = "Accepting Call. Please Wait..";
						// }
						this.order_id = noteData.notification.additionalData.order_id;
						this.acceptCall();
						return false;
					}

					if(clickAction == 'decline'){
						// this.rejectCallBack(noteData.notification.additionalData);
						// if(this.appOpen == 0){
						// 	this.overlayMsg = "Rejecting Call. Please Wait..";
						// }
						return false;
					}

					if(clickAction == 'end_call'){
						this.stopCall();
						return false;
					}

					if(noteData.notification.additionalData.type == 'incoming_call'){
						// this.order_id = noteData.notification.additionalData.order_id;
						// this.showIncomingCallModal();
						return false;
						// if(this.appOpen == 0){
						// 	this.overlayMsg = "Waiting for Incoming Call";
						// }
					}
			  	});

			  	this.misc.onesignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {
					// this.appOpen = 1;
					var data = notificationReceivedEvent.notification.additionalData;
					console.log(notificationReceivedEvent.notification);
					if(!(data == undefined)){
						if(data.type == 'incoming_call'){
							// this.order_id = data.order_id;
							// this.showIncomingCallModal();
							notificationReceivedEvent.complete(notificationReceivedEvent.notification);
						}
						else{
							if(data.type == 'disconnect'){
								var extension = {
									initiator: 0
								};
								if(!(this._session == null)){
									this._session.stop(extension);
									this.hideOutgoingCallModal();
									this.hideIncomingCallModal();
									this.hideOnCallModal();
								}
							}
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
	  	catch(err){
	  		console.log(err);
	  	}
	}
	receiveMessage(){
		
		if((!(this.userDets == null)) && (!(this.userDets == undefined)) && (!(this.userDets.id == undefined)) ){
			if(this.noteRefSub){
				this.noteRefSub.unsubscribe();
			}
			this.noteRef = this.db.object('user'+this.userDets.id);
			this.noteRefSub = this.noteRef.snapshotChanges().subscribe(action => {
				console.log(action.payload.val());
				if(!(action.payload.val() == null) && (!(action.payload.val() == ""))){
					var message = JSON.parse(action.payload.val());
					console.log(message);
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

					if(message.type == 'incoming_call'){
						this.order = message.order;
						this.other_user = message.other_user;
						if(this.platform.is('android')){
							// this.cordovaCall.receiveCall('Incoming Call via Samanta',(e) => {
							// 	console.log('sfsadas', e);
							// },
							// (err) => {
							// 	console.log(err);
							// });
						}
						this.showIncomingCallModal();
					}

					if(message.type == "stop_call"){
						if(this.on_call == 0){
							return false;
						}

						this.hideOnCallModal();
						this.hideOutgoingCallModal();
						this.hideIncomingCallModal();
						if((!(this._session == null)) && (this._session.currentRoomId == this.order.meeting_id)){
							this._session
							.leave()
							.then(() => {
								this._session = null;
							})
							.catch((error) => {
								console.log(error);
							});
						}
					}

					if(message.type == 'reject_call'){
						// this.resetDialingCallback();
						this.hideOnCallModal();
						this.hideOutgoingCallModal();
						this.hideIncomingCallModal();
						if((!(this._session == null)) && (this._session.currentRoomId == this.order.meeting_id)){
							this._session
							.leave()
							.then(() => {
								this._session = null;
							})
							.catch((error) => {
								console.log(error);
							});
						}
					}

					if(message.type == 'reconnect'){
						this.order.meeting_id = message.meeting_id;
						this.startCall();
					};
				}
			});
		}
		this.db.object(".info/connected")
		.snapshotChanges()
		.subscribe(action => {
			console.log('fbconnnn',action.payload.val());
			this.internet = action.payload.val();
			// if(this.prev_conn_val == false && action.payload.val() == true){
			// 	console.log('init firebase');
			// 	this.prev_conn_val = action.payload.val();
			// 	setTimeout(() => {
			// 		this.receiveMessage();
			// 		return;
			// 	}, 2000);
			// }
			// else{
			// 	this.prev_conn_val = action.payload.val();
			// }
		});
	}

	connectingTimeoutCallback = () => {
		// var count = 0;
		// this.connCallBck = setInterval(() => {
		// 	count++;
		// 	if(count > 4){
		// 	clearInterval(this.connCallBck);
				
		// 		this.stopCall();
		// 	}
		// }, 5000);
	};

	resetConnectingCallBack = () => {
		// clearInterval(this.connCallBck);
		// this.connCallBck = null;
	};

	dialingCallback = () => {
		// this.dialCallBck = setTimeout(() => {
		// 	this.stopCall();
		// }, 60000);
	};

	resetDialingCallback = () => {
		// clearTimeout(this.dialCallBck);
		// this.dialCallBck = null;
	};


  	listenEvents(){
  		this.platform.ready().then(() => {

			document.addEventListener("offline", () => {
				this._ngZone.run(() => {
					// this.onInternetDisconnected();
				});
			}, false);

			document.addEventListener("online", () => {
				this._ngZone.run(() => {
					this.reloadApp();
				});
			});
			window.ononline = () => {
				this._ngZone.run(() => {
					this.reloadApp();
				});
			    // alert('You are now online');
			}

			window.onoffline = () => {
			    // alert('You are now offline');
			    this._ngZone.run(() => {
					// this.onInternetDisconnected();
				});
			}

			try{
				ConnectyCube.chat.onReconnectListener = undefined;
				ConnectyCube.chat.onDisconnectedListener = undefined;
				ConnectyCube.videochat.onCallListener = undefined;
				ConnectyCube.videochat.onAcceptCallListener = undefined;
				ConnectyCube.videochat.onRemoteStreamListener = undefined;
				ConnectyCube.videochat.onRejectCallListener = undefined;
				ConnectyCube.videochat.onStopCallListener = undefined;
				ConnectyCube.videochat.onUserNotAnswerListener = undefined;
				ConnectyCube.videochat.onSessionConnectionStateChangedListener = undefined;
			}
			catch(err){
				console.log(err);
			}

        		try{
				if(this.platform.is('ios')){
					this.cordovaCall.on('answer', (event) => {
						console.log(event);
						this._ngZone.run(() => {
							this.acceptCall();
						});
					});
				}
				ConnectyCube.chat.onReconnectListener = this.onReconnectListener.bind(this);
				ConnectyCube.chat.onDisconnectedListener = this.onDisconnectedListener.bind(this);
				ConnectyCube.videochat.onCallListener = this.onCallListener.bind(this);
				ConnectyCube.videochat.onAcceptCallListener = this.onAcceptCallListener.bind(this);
				ConnectyCube.videochat.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
				ConnectyCube.videochat.onRejectCallListener = this.onRejectCallListener.bind(this);
				ConnectyCube.videochat.onStopCallListener = this.onStopCallListener.bind(this);
				ConnectyCube.videochat.onUserNotAnswerListener = this.onUserNotAnswerListener.bind(this);
				ConnectyCube.videochat.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener.bind(this);
			}
			catch(err){
				console.log(err);
			}

		});

	}


	reloadApp(){
		if(this.dialing == 1 || this.incoming == 1 || this.on_call == 1){
			setTimeout(() => {
				this.reloadApp();
			}, 1000);
			return;
		}
		location.reload();
	}

	onReconnectListener = () => {

	}

	// Event fired when incoming call is received.
	onCallListener = (session, extension) => {
		if(extension.auto_accept == 1){
			this._session = session;
			if(this.on_call == 0){
				var extension1 = {};
				this._session.reject({
					reject_auto: 1
				});
			}
			this._session
			.getUserMedia(this.mediaParams)
			.then((stream) => {
				console.log('stream got');
				this._session.attachMediaStream("localStream", stream, {
					muted: true,
					mirror: true,
				});
				let extension = {};
				this._session.accept(extension);
				// this.showOnCallModal();
			})
			.catch((error) => {
				console.log(error);
			});
			return false;
		}
		this._session = session;
		this.order = extension.order;
		this.other_user = extension.other_user;
		this.showIncomingCallModal();
	};

	// Event fired when other user accepts incoming call.
	onAcceptCallListener = (session, userId, extension) => {
		this.connecting = 1;
		this.showOnCallModal();
	};

	// Event fired when stream is received from the other side.
	onRemoteStreamListener = (session, userID, remoteStream) => {
		console.log('got remote stream');
		// attach the remote stream to DOM element
		this._session.attachMediaStream("remoteStream", remoteStream);
		// this._session.unmute();
		this._ngZone.run(() => {
			setTimeout(() => {
				this.router.navigate(['/']);
				this.connecting = 0;
				this.getChatData();
				this.callStartTime = new Date();
				this.timeInt = setInterval(() => {
					this.getRemainingTime();
				}, 1000);
			}, 2000);
		});
		// console.log(this._session.peerConnections[this.other_user.calling_id].restartIce());
	};

	// Event fired when call is rejected from the other side.
	onRejectCallListener = (session, userId, extension:any = {}) => {
		console.log('rejected');
	    	this.hideOutgoingCallModal();
		if(extension.reject_auto == 1){
			this.stopCall();
		}
		else{
			window.location.href = "/summary/"+this.order.id;
		}

	};

	// Event fired when call is ended from either side.
	onStopCallListener = (session, userId, extension) => {
		console.log('stopped by ', session);
		console.log('current session', this._session);
		// if(session.currentUserId == )
		if(extension.initiator == 1){
			let extension1 = {
				inititator: 0
			};
			console.log('1');
			this._session.stop(extension1);
			this.hideOnCallModal();
			this.hideIncomingCallModal();
			this.hideOutgoingCallModal();
		}
		// this._session.
  	};

	// When call was not received on the other side.
  	onUserNotAnswerListener = (session, userId) => {
		let extension = {
			initiator: 1
		};
		this._session.stop(extension);
		this.setCallLog(this.userDets.id, 'no_answer', new Date());
		window.location.href = "/summary/"+this.order.id;
  	};


	callUser(id, order_id){
		this.ongoingCall = "";
	    	this.call.call(id, order_id);
  	}

	// Initiate outgoing call.
	callInit(order,order_id){
		this.showOutgoingCallModal();
		if(this.chat_connected == 0){
			setTimeout(() => {
				this.callInit(order, order_id);
			}, 2000);
			return false;
		}
		console.log(order);
		var data = {
			'order_id': order_id,
			'outgoing': 1
		};
		this.api.getOrderDetails(data)
	    	.then(resp => {
	    	console.log(resp);
	    	this.order = resp.data.order;
	    	this.other_user = resp.data.user;
			if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
			this.calleesIds = [this.other_user.calling_id]; // User's ids
			this.startCall();
		})
		.catch(err => {
			this.hideOutgoingCallModal();
			console.log(err);
			this.misc.handleError(err);
		});
	}

	// When call is received from button on ios, End callkit to prepare audi session for video streaming.
	acceptCallMid = () => {
		if(this.platform.is('ios')){
			this.cordovaCall.endCall();
		}

		this.acceptCall()
	}

  	acceptCall = () => {
		this.showOnCallModal();
		if(this.call_stopped == 1){
			this.call_stopped = 0;
			return false;
		}
		if(this.on_call == 1 && this._session == null){
			setTimeout(() => {
				this.acceptCall();
			},1000);
			return false;
		}
		this.setCallLog(this.userDets.id, 'received', new Date());

		this._session
		.getUserMedia(this.mediaParams)
		.then((stream) => {
			console.log('stream got');
			this._session.attachMediaStream("localStream", stream, {
				muted: true,
				mirror: true,
			});
			let extension = {};
			this._session.accept(extension);
			// this.showOnCallModal();
		})
		.catch((error) => {
			console.log(error);
		});
  	};

  	setAudioForCall = () => {
		// if(this.platform.is('ios')){
		// 	await cordova.plugins.iosrtc.initAudioDevices();
		// 	await cordova.plugins.iosrtc.selectAudioOutput('speaker');
		// 	await cordova.plugins.iosrtc.turnOnSpeaker(true);
		// 	await AudioToggle.setAudioMode('speaker');
		// }
  	};

  	rejectCall = () => {
		this.hideIncomingCallModal();
	    	this._session.reject();
	    	if(this.platform.is('ios')){
			this.cordovaCall.endCall();
		}
  	};

  	startAudioCall = () => {
	    this.startCall()
  	}

  	joinToRoom = () => {
	    this.startCall()
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
				// 'session': this._session
			};
			this.api.sendCallLog(data)
			.then(resp => {
				console.log(resp);
			})
			.catch(err => {
				console.log(err);
			});
		}
	}
	

  	startCall = (callType=null, resume=0) => {

		try{
			if(this.platform.is('ios')){
				this.cordovaCall.connectCall();
			}

			var options = {

			};

			this._session = ConnectyCube.videochat.createNewSession(
				this.calleesIds,
				ConnectyCube.videochat.CallType.VIDEO,
				options
			);

			this._session
			.getUserMedia(this.mediaParams)
			.then((stream) => {
				console.log('stream got');
				this._session.attachMediaStream("localStream", stream, {
					muted: true,
					mirror: true,
				});

				let extension = {
					order: this.order,
					other_user: this.userDets,
					auto_accept: 0
				};
				this._session.call(extension, error => {

				});
				this.setCallLog(this.userDets.id, 'init_call', new Date());
			})
			.catch((error) => {
				console.log(error);
			});
		}
		catch(err){
			console.log(err);
			setTimeout(() => {
				this.startCall()
			}, 5000)
		}
	};

	resetCall = (callType=null, resume=0) => {
		if(this.internet == false){
			setTimeout(() => {
				this.resetCall();
			}, 2000);
			return false;
		}

		try{
			// if(this.userDets.user_type == 3){
				const params = {
					name: "My meeting",
					// start_date: order_date,
					// end_date: new Date(order_date.setHours(order_date.getHours() + 4)),
					attendees: [
						{ id: parseInt(this.userDets.calling_id)},
						{ id: parseInt(this.other_user.calling_id)}
					],
					record: false,
					chat: true
				};
	
				ConnectyCube.meeting.create(params)
				.then(meeting => {
					let confRoomId = meeting._id;
					var data1 = {
						order_id: this.order.id,
						meeting_id: confRoomId
					};
					this.api.updateMeetingId(data1)
					.then(resp => {
						this.order.meeting_id = confRoomId;
						this.startCall();
						var message = {
							type: 'reconnect',
							meeting_id: confRoomId
						};
						this.sendCallMsgs(this.other_user.id, JSON.stringify(message));
					})
					.catch(err => {
	
					});
				})
				.catch(error => { });
			// }
		}
		catch(err){
			
		}
	};

	stopCall = (befcon = 0) => {
		// if(this.on_call == 1 && this._session == null){
			// setTimeout(() => {
				// this.stopCall();
			// }, 1000);
			// return false;
		// }

		let extension = {
			initiator: 1
		};

		if(!(this._session == null)){

			console.log('2');
			this._session.stop(extension);
			if(befcon == 1){
				this.setCallLog(this.userDets.id, 'no_answer', new Date());
			}
			else{
				this.setCallLog(this.userDets.id, 'disconnected', new Date());
			}
		}

		this.hideOnCallModal();
		this.hideIncomingCallModal();
		this.hideOutgoingCallModal();
  	};

  	onDevicesChangeListener = () => {
	    // if (iOS) return;

	    // ConnectyCube.videochat
      	// .getMediaDevices("videoinput")
      	// .then((mediaDevices) => {
	    //     this.mediaDevicesIds = mediaDevices?.map(({ deviceId }) => deviceId);

	    //     if (this.mediaDevicesIds.length < 2 || this._session.callType === ) {
	    //       this.$switchCameraButton.disabled = true;

	    //       if (this.activeDeviceId &&
	    //         this.mediaDevicesIds?.[0] !== this.activeDeviceId &&
	    //         !this.isSharingScreen
	    //       ) {
	    //         this.switchCamera();
	    //       }
	    //     } else {
	    //       this.$switchCameraButton.disabled = false;
	    //     }
      	// });
  	};


  	onSessionConnectionStateChangedListener = (
	    session,
		userId,
	    iceState
  	) => {
		console.log(session);
		console.log(userId);
		console.log('RCE: ', iceState);
		if(iceState == ConnectyCube.videochat.SessionConnectionState.DISCONNECTED){
			this._ngZone.run(() => {
				this.reconnecting = 1;
				setTimeout(() => {
					if(this.reconnecting == 1){
						this.stopCall();
					}
				}, 3000);
				// this.reInitCallService();
				// this._session.peerConnections[this.other_user.calling_id].restartIce()
			});
		}

		if(iceState == ConnectyCube.videochat.SessionConnectionState.FAILED){
			// this._ngZone.run(() => {
				console.log('reconnecting after failed', this._session.state);
				// if(this._session.state == 5){
					console.log('reconnecting after failed again');
					// this.reconnecting = 1;
					// return false;
				// }
				// else{
					let extension = {};
					this._session.stop(extension);
					this._session = null;
					this.hideOutgoingCallModal();
					this.hideIncomingCallModal();
					this.hideOnCallModal();
					// if(this.userDets.user_type == 3){
					// 	this.reInitCallService();
					// }
				// }
				// this._session.peerConnections[this.other_user.calling_id].restartIce()
			// });
		}



		if(iceState == ConnectyCube.videochat.SessionConnectionState.CONNECTED){
			this._ngZone.run(() => {
				this.reconnecting = 0;
			});
		}
  	};

  	reconnectVideo(){
  		
  	}

  	setActiveDeviceId = (stream) => {
    	
  	};
	setAudioMute = () => {
		if(this.audio_muted == 0){
			this._session.mute("audio");
			this.audio_muted = 1;
			var call_message = {
				'type': 'audio_muted',
				'value': this.audio_muted
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
		else{
			this._session.unmute("audio");
			this.audio_muted = 0;
			var call_message = {
				'type': 'audio_muted',
				'value': this.audio_muted
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
	};

	setVideoMute = () => {
		if(this.video_muted == 0){
			this._session.mute("video");
			this.video_muted = 1;
			var call_message = {
				'type': 'video_muted',
				'value': this.video_muted
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
		else{
			this._session.unmute("video");
			this.video_muted = 0;
			var call_message = {
				'type': 'video_muted',
				'value': this.video_muted
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));
		}
	};

  	restartICE = () => {
		
  	};

  	switchCamera = () => {
	    
	};


	sharingScreen = () => {
	    
	};

	updateSharingScreenBtn = () => {
	    
	};

	stopSharingScreen = () => {
	    
  	};

  	updateStream = (stream) => {
	    
  	};

  	/* SNACKBAR */

  	showSnackbar = (infoText) => {
  		console.log(infoText);
	    
  	};

  	/*OUTGOING CALL MODAL */

  	showOutgoingCallModal = () => {
  		this._outgoingCallModal("show");
  	};

  	hideOutgoingCallModal = () => {
  		this._outgoingCallModal("hide");
  	};


  	_outgoingCallModal = (className) => {
	    this._ngZone.run(() => {
			if (className === "hide") {
				this.dialing = 0;
			} else {
				this.dialing = 1;
			}
		});
  	};

  	

  	/*INCOMING CALL MODAL */

  	showIncomingCallModal = () => {
  		this._incomingCallModal("show");
    		this.showIncomingNotification();
    		if(this.platform.is('cordova') && this.platform.is('android')){
			cordova.plugins.RingtonePlayer.play();
			this.bringAppToForeground();
		}
  	};

  	hideIncomingCallModal = () => {
  		this._incomingCallModal("hide");
  		this.hideCallNotification();
    		if(this.platform.is('cordova') && this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
  	};


  	_incomingCallModal = (className) => {
	    this._ngZone.run(() => {
	    	if (className === "hide") {
		    	this.incoming = 0;
		    } else {
		    	this.incoming = 1;
		    }
	    });
  	};

  	showIncomingNotification(){
		// if(this.platform.is('android')){

		// 	cordova.plugins.notification.local.cancelAll();
		// 	cordova.plugins.notification.local.schedule({
		// 	    title: this.other_user.name,
		// 	    text: "Incoming Video Call via Samanta",
		// 	    foreground: true,
		// 	    smallIcon: 'res://ic_stat_onesignal_ring',
		// 	    ongoing: true,
		// 	    priority: 10,
		// 	    channel: 'call_channel_local',
		// 	    actions: [
		// 	        { id: 'accept', title: 'Accept' },
		// 	        { id: 'decline',  title: 'Decline' }
		// 	    ]
		// 	});
		// }
	}

	showOngoingCallNotification = () => {
		// if(this.platform.is('android')){
		// 	cordova.plugins.notification.local.cancelAll();
		// 	cordova.plugins.notification.local.schedule({
		// 		id: 1,
		// 	    title: this.other_user.name,
		// 	    text: "Ongoing Video Call via Samanta",
	    //         foreground: true,
		// 	    ongoing: true,
		// 	    smallIcon: 'res://ic_stat_onesignal_call',
		// 	    priority: 1,
		//     	channel: 'call_channel_ongoing',
		// 	    actions: [
		// 	        { id: 'end_call', title: 'End Call' }
		// 	    ]
		// 	});
		// }
	}

  	hideCallNotification(){
		if(this.platform.is('cordova') && this.platform.is('android')){
  			// cordova.plugins.notification.local.cancelAll();
		}
  	}

  	// On Call Modal
  	showOnCallModal = () => {
		this.connecting = 1;
		if(this.platform.is('cordova') && this.platform.is('android')){
			cordova.plugins.RingtonePlayer.stop();
		}
  		this._onCallModal("show");
  		this.showOngoingCallNotification();
  	};

  	hideOnCallModal = () => {
  		const video:any = document.getElementById("localStream");
      		if(!(video.srcObject == undefined || video.srcObject == null)){
			for(const track of video.srcObject.getTracks()) {
				track.stop();
			}
	  	}
		const video_rem:any = document.getElementById("remoteStream");
		  if(!(video_rem.srcObject == undefined || video_rem.srcObject == null)){
		    for(const track of video_rem.srcObject.getTracks()) {
			    track.stop();
		    }
	      	}
		this.connecting = 0;
		this._session = null;
  		this._onCallModal("hide");
		if(this.platform.is('ios')){
			this.cordovaCall.endCall();
		}
		this.callExtendShown = 0;
		this.callExtendRequest = 0;
		this.rem_text = "";
		this.minutes = "";
		this.seconds = "";
		
		this.audio_muted = 0;
		this.video_muted = 0;
		this.remote_audio_muted = 0;
		this.remote_video_muted = 0;
		this.reconnecting = 0;
		this.chatWin = 0;
		
		clearInterval(this.timeInt);
		this.timeInt = null;
		window.location.href = "/summary/"+this.order.id;
		// this.router.navigate(["/summary/"+this.order.id]);
		// this.cordovaCall.endCall();
  		// this.hideCallNotification();
  	};

  	_onCallModal = (className) => {

	    this._ngZone.run(() => {
	    	if (className === "hide") {
		    	this.on_call = 0;
		    } else {
		    	this.on_call = 1;
		    }
		});

  	};


  	_getUserById = (userId, key) => {
  		return "dummyName";
  	};

  	_prepareVideoElement = (videoElement) => {
	//     const $video:any = document.getElementById(videoElement);
  	};

  	muteSound = () => {

  	};
	muteVideo = () => {

  	};


  	sendCallMsgs(id, message){
		if(this.internet == false){
			setTimeout(() => {
				this.sendCallMsgs(id, message);
			}, 1000);
			return false;
		}
		// console.log(id);
		let sendRef = this.db.object('user'+id);
		sendRef.set(message);
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
          		if(status == 1){
				var trigger_time = new Date(new Date(order_date).getTime() - 300000);  
				// console.log(trigger_time);
				// this.localNotifications.schedule({
				//    	title: "Upcoming order.",
				//    	text: 'Thank you for using Samanta. Your client booking begins in five minutes. Please be online and prepared for the appointment.',
				//    	trigger: {at: trigger_time},
				//    	led: 'FF0000',
				//    	sound: null
				// });
			}

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


	getRemainingTime(){
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
			this.timeInt = null;
			if(!(this.userDets.user_type == 3)){
				this.stopCall();
				return;
			}
		}
		else{
			if(!(this.callToEnd == null)){
				if(((new Date()).toISOString()) >= this.callToEnd){
					clearInterval(this.timeInt);
					if(!(this.userDets.user_type == 3)){
						this.stopCall();
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
			if(minutes < 2 && this.order.user_id == this.userDets.id && this.callExtendShown == 0){
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

	// Receive and subscribe to messages.

	getChatData(){
		// this.userDets = this.misc.getUserDets();
		this.chatMsgs = [];
		this.itemRef = this.db.object('chat'+this.order.id);
		this.itemRefSub = this.itemRef.snapshotChanges().subscribe(action => {
			if(!(action.payload.val() == null)){
				this.chatMsgs = action.payload.val();
				if(!(this.chatMsgs == "")){
					this.chatMsgs = JSON.parse(this.chatMsgs);
					this.chatMsgs.map((item,index) => {
						if(item.from == this.other_user.id){
							if(item.read == 0){
								this.newChat = 1;
								return false;
							}
						}
					});
					// this.newChat = 0;
					// if(this.chatWin == 0){
					// 	this.newChat = 1;
					// }
				}
				else{
					this.chatMsgs = [];
				}
			}
		});
	}

	//Send Chat Message

	sendMsg(){
		if(this.message == ""){
			this.misc.showToast('Please enter a message.');
			return;
		}

		var data = {
			"message": this.message,
			"from": this.userDets.id,
			read: 0
		};

		this.chatMsgs.push(data);

		var apidata = JSON.stringify(this.chatMsgs);
		const sendRef = this.db.object('chat'+this.order.id);
		sendRef.set(apidata);
		this.message = "";
	}

	openChatWindow = () => {
		this.newChat = 0;
		this.chatWin = (this.chatWin == 0)?1:0;
		this.chatMsgs.map((item, index) => {
			var this_msg = item;
			if(this_msg.from == this.other_user.id){
				this_msg.read = 1;
			}
			this.chatMsgs[index] = this_msg;
		});
		var apidata = JSON.stringify(this.chatMsgs);
		const sendRef = this.db.object('chat'+this.order.id);
		sendRef.set(apidata);
	};


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
	


  	callDestroy(){
		// alert('sdsdsa');
		// ConnectyCube.chat.disconnect();
		this._ngZone.run(() => {
			// this.userLoggedIn = 0;
			// if(this.timeInt){
			// 	clearInterval(this.timeInt);
			// }
			// if(this.noteInt){
			// 	clearInterval(this.noteInt);
			// }
			// this.userDets = null;
			// this.lastUser = null;
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('user');
			ConnectyCube.chat.disconnect();
			ConnectyCube.logout().catch((error) => {});
			ConnectyCube.destroySession();
			axios.defaults.headers.common['Authorization'] = 'Bearer ';
			// this.router.navigate(['/login']);
			window.location.href = "/login";
			// ConnectyCube.destroySession().catch((error) => {});
		});
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

}