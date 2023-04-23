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
	    audio: false,
	    video: true,
	    // elementId: "localStream",
	    // options: {
	      // muted: true,
	      // mirror: true,
	    // },
  	};
  	calleesIds:any = [];
  	incoming:any = 0;
  	on_call:any = 0;
  	dialing:any = 0;
  	video_loading:any = 0;
  	userDets:any = {};
  	callToEnd:any;
	noteRef:any;
	noteRefSub:any;
	prev_conn_val:any = true;
	cordovaCall:any;
  	connected:any = 0;
	showTopPerm:any = 0;
	showAudioPermPop:any = 0;
	showVideoPermPop:any = 0;
	overlayMsg:any = "";
	callExtendRequested:any = 0;
	callExtended:any = 0;
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
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
	restartEN:any = 0;

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
		this.call.initCall(this.callInit.bind(this));
		this.call.initDestroy(this.callDestroy.bind(this));
		this.firebase.initSendCallMsg(this.sendCallMsgs.bind(this));
		this.platform.ready().then(() => {
			this.cordovaCall = cordova.plugins.CordovaCall;
			
			// this.OneSignalInit();
			if(this.platform.is('ios')){
				cordova.plugins.iosrtc.registerGlobals();
			}

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
			// this.userDets = this.misc.getUserDets();
			this.OneSignalInit();
			this.voipInit();
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
  		// this.listenEvents();
  		// alert('sdas');
  		let CREDENTIALS = {
		  	appId: 6798,
		  	authKey: "KbVKtzAQvPFAdtw",
		  	authSecret: "zrXRtdLamjF7fmq"
		};

		let CONFIG = {
			chat: {
			    // reconnectionTimeInterval: 1,
			//     ping: {
			//       enable: true,
			//       timeInterval: 1
			//     }
				// reconnectionTimeInterval:0,
		  	},
			// videochat: {
			// 	alwaysRelayCalls: false,
			//     answerTimeInterval: 600,
			    // dialingTimeInterval: 5
		    // },
		  	debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
		};

  		ConnectyCube.init(CREDENTIALS, CONFIG);

      	// this.$loader.classList.remove("hidden");
      	// this.$caption.classList.add("hidden");
		let user = {
			password: "supersecurepwd",
			email: this.userDets.email
		};
      	ConnectyCube.createSession(user)
        .then(() => {
        	this.listenEvents();
        	// ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" });
    	})
        .then(() => {
			// this.connected = 1;
          	// this.$loginScreen.classList.add("hidden");
          	// this.$callScreen.classList.remove("hidden");
          	// this.$loader.classList.add("hidden");
          	// this.$caption.classList.remove("hidden");
          	// resolve();
        })
        .catch((err) => {

        });
  	};

  	logout = () => {
	    ConnectyCube.chat.disconnect();
	    ConnectyCube.destroySession();

	    // this.$callScreen.classList.add("hidden");
	    // this.$loginScreen.classList.remove("hidden");
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
							// this.ringing = 1;
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
							this.cordovaCall.receiveCall('Incoming Call via Samanta',(e) => {
								console.log('sfsadas', e);
							},
							(err) => {
								console.log(err);
							});
						}
						this.showIncomingCallModal();
					}

					if(message.type == "stop_call"){
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
				}
			});
		}
		this.db.object(".info/connected")
		.snapshotChanges()
		.subscribe(action => {
			console.log('fbconnnn',action.payload.val());
			if(action.payload.val() == true){
				if(this.restartEN == 1){
					this.restartEN = 0;
					this.restartICE();
				}
			}
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


  	listenEvents(){
  		this.platform.ready().then(() => {
			this.cordovaCall.on('answer', (event) => {
				console.log(event);
				this.acceptCall();
			});
			// this.platform.resume.subscribe(() => {
			// 	this.state = 'resumed';
			// 	console.log('resumed');
			// 	this.cordovaCall.endCall();
			// 	this.setAudioForCall();
			// });
			// this.platform.pause.subscribe(() => {
			// 	this.state = 'paused';
			// 	console.log('paused');
			// 	// this.cordovaCall.endCall();
			// });
			// this.firebasex.onMessageReceived()
			// .subscribe(data => {
			// 	console.log(data);
			// 	if(data.notification_foreground){
			// 		this.order_id = data.order_id;
			// 		// this._ngZone.run(() => {
			// 		// 	this.overlayMsg = "Waiting for Incoming Call";
			// 		// 	// alert('incoming');
			// 		// });
			// 		this.showIncomingCallModal();
			// 		// this.incoming = 1;
			// 	}
			// 	// this.sendAppToBackground();
			// });

        		try{
					ConnectyCube.videochatconference.onParticipantJoinedListener = this.onParticipantJoinedListener.bind(this);
					ConnectyCube.videochatconference.onParticipantLeftListener = this.onParticipantLeftListener.bind(this);
					ConnectyCube.videochatconference.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
					ConnectyCube.videochatconference.onSlowLinkListener = (session, userId, uplink, nacks) => {};
					ConnectyCube.videochatconference.onRemoteConnectionStateChangedListener = this.onRemoteConnectionStateChangedListener.bind(this);
					ConnectyCube.videochatconference.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener.bind(this);
					// ConnectyCube.videochatconference.onMessage/Listener = this.onMessageListener.bind(this);
				}
				catch(err){
					console.log(err);
				}
		});

	}

	onRemoteConnectionStateChangedListener = (session, userId, iceState) => {
		if(iceState == 'disconnected'){
			if((!(this._session == null)) && (this._session.currentRoomId == this.order.meeting_id)){
				this.restartEN = 1
			}
			// this.restartICE();
		}
	};


	onMessageListener = () => {
		alert('got message');
	};

	onParticipantJoinedListener = (session, userId, userDisplayName, isExistingParticipant) => {
		this._ngZone.run(() => {
			this.cordovaCall.connectCall();
			console.log('joined');
			this.showOnCallModal();
			this.hideOutgoingCallModal();
			this.hideIncomingCallModal();
		});
	};

	// onRemoteStreamListener = (session, userId, stream) => {
	// 	console.log('asdasd');
	// };

	onParticipantLeftListener = (session, userId) => {
		console.log('left');
		// this.hideOnCallModal();
		// this.hideOutgoingCallModal();
		// this.hideIncomingCallModal();
		// if((!(this._session == null)) && (this._session.currentRoomId == this.order.meeting_id)){
		// 	this._session
		// 	.leave()
		// 	.then(() => {
		// 		this._session = null;
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
		// }
	}

	onInternetDisconnected(){
		// this._ngZone
		this.connected = 0;
		console.log('offline app');
		// ConnectyCube.chat.markInactive();
	}

	onInternetReconnected(){
		console.log('online app');
		setTimeout(() => {
			// this.reInitCallService();
		}, 2000);
		// ConnectyCube.chat.markActive();
	}

	onDisconnectedListener = () => {
		console.log('chat disconnected');
		// console.log(p1);
	}

	onReconnectListener = () => {
		console.log('chat reconnected');
		// this.reInitCallService();
		// console.log(p1);
	};


	async callInit(order,order_id){
		console.log(order);
		// if(this.connected == 0){
		// 	setTimeout(() => {
		// 		this.callInit(order_id);
		// 	}, 1000);
		// 	return;
		// }
		// setTimeout(() => {
	    	this.router.navigate(['/']);
	    // }, 2000);
		// alert(order_id);
		// this.dialing = 1;

		this.showOutgoingCallModal();
		var data = {
	      	'order_id': order_id,
	      	'outgoing': 1
	    };
	    this.api.getOrderDetails(data)
	    .then(resp => {
	    	console.log(resp);
	    	this.order = resp.data.order;
	    	this.other_user = resp.data.user;
			this.cordovaCall.sendCall('Outgoing Call via Samanta');
				if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
			this.calleesIds = [this.other_user.calling_id]; // User's ids
			// const dialog = this.order.meeting_id;
			// const opponentId = this.other_user.calling_id;
			// const message = {
			// 	type: 'chat',
			// 	body: "How are you today?",
			// 	extension: {
			// 		save_to_history: 1,
			// 		// dialog_id: this.order.meeting_id
			// 	},
			// 	markable: 1
			// };

			// ConnectyCube.chat.send(opponentId, message);
			// message.id = ConnectyCube.chat.send(opponentId, message);
			var message = {
				type: 'incoming_call',
				order: this.order,
				other_user: this.userDets
			};
			this.sendCallMsgs(this.other_user.id,JSON.stringify(message));
	        this.setCallLog(this.userDets.id, 'init_call', new Date());
	    	this.joinToRoom();
    	})
    	.catch(err => {
    		this.hideOutgoingCallModal();
    		console.log(err);
    		this.misc.handleError(err);
    	});

	}


	// async startCall(){
		// let calleesIds = [this.other_user.calling_id]; // User's ids

	defaultSettings = () => {
    	// if (isMobile) {
      	// 	this.$switchSharingScreenButton.disabled = true;
    	// }
  	};


	// showSnackbar(msg){
	// 	console.log(msg);
	// }

  	addStreamElements = (opponents) => {
	    // const $videochatStreams = document.getElementById("videochat-streams");
	    // const $videochatStreamsTemplate = document.getElementById(
	    //   "videochat-streams-template"
	    // );
	    // const videochatStreamsTemplate = Handlebars.compile(
	    //   $videochatStreamsTemplate.innerHTML
	    // );

	    // if (opponents.length === 2) {
	    //   $videochatStreams.classList.value = "grid-2-1";
	    // } else if (opponents.length === 3) {
	    //   $videochatStreams.classList.value = "grid-2-2";
	    // }

	    // document.getElementById("call").classList.add("hidden");
	    // document.getElementById("videochat").classList.remove("hidden");
	    // $videochatStreams.innerHTML = videochatStreamsTemplate({ opponents });
  	};

	onCallListener = (session, extension) => {
		
	};

	onAcceptCallListener = (session, userId, extension) => {
		
	};

	onRejectCallListener = (session, userId, extension:any = {}) => {
	    
	};


	onStopCallListener = (session, userId, extension) => {

  	};

  	onUserNotAnswerListener = (session, userId) => {
	    
  	};

  	onRemoteStreamListener = (session, userId, stream) => {
	    if (!this._session) {
	      return false;
	    }

	    let remoteStreamSelector = `remoteStream`;
		this._session.attachMediaStream(remoteStreamSelector, stream);

  	};


  	acceptCall = () => {
		if(this.order.id == undefined){
			setTimeout(() => {
				this.acceptCall();
			}, 1000);
			return false;
		}
  		this.showOnCallModal();
		this.hideIncomingCallModal();
		this.joinToRoom();
  		// this.order_id = 
  		// var data = {
		// 	'order_id': this.order_id
		// };
	    // 	this.api.getOrderDetails(data)
	    // 	.then(async (resp) => {
	    // 	console.log(resp);
	    // 	this.order = resp.data.order;
	    // 	this.other_user = resp.data.user;
	    // 	if(!(resp.data.end_time == null)){
		// 	this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
		// }
		// this.calleesIds = [this.other_user.calling_id]; // User's ids
	        // this.setCallLog(this.userDets.id, 'init_call', new Date());
    	// })
    	// .catch(err => {
    		// this.hideOutgoingCallModal();
    		// console.log(err);
    		// this.misc.handleError(err);
    	// });
  	};

  	setAudioForCall = async () => {
		if(this.platform.is('ios')){
			await cordova.plugins.iosrtc.initAudioDevices();
			await cordova.plugins.iosrtc.selectAudioOutput('speaker');
			await cordova.plugins.iosrtc.turnOnSpeaker(true);
			await AudioToggle.setAudioMode('speaker');
		}
  	};

  	rejectCall = (session, extension = {}) => {
	    
  	};

  	startAudioCall = () => {
	    this.startCall(ConnectyCube.videochat.CallType.AUDIO)
  	}

  	joinToRoom = () => {
	    this.startCall(ConnectyCube.videochat.CallType.VIDEO)
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
			this._session = ConnectyCube.videochatconference.createNewSession();
			// console.log(this._session);

			if(this._session.currentRoomId == this.order.meeting_id){
				return;
			}
			// if(this.state == 'paused'){

			// }
			// else{
			// this.cordovaCall.receiveCall('Temp Call');
			// this.cordovaCall.mute();
			this.setAudioForCall();
			this._session
			.getUserMedia(this.mediaParams)
			.then((stream) => {
				console.log('stream got');
				this._session.attachMediaStream("localStream", stream, {
					muted: true,
					mirror: true,
				});

				this._session
				.join(this.order.meeting_id, parseInt(this.userDets.calling_id), this.userDets.name)
				.then(() => {
					console.log('joined');
				})
				.catch((error) => {
					console.log(error);
				});
			})
			.catch((error) => {
				console.log(error);
			});
		}
		catch(err){
			console.log(err);
			// setTimeout(() => {
				this.startCall()
			// }, 1000)
		}
	};

	restartCall = (callType=null, resume=0) => {

		try{
			this._session = ConnectyCube.videochatconference.createNewSession();
			// console.log(this._session);

			if(this._session.currentRoomId == this.order.meeting_id){
				return;
			}
			// if(this.state == 'paused'){

			// }
			// else{
			// this.cordovaCall.receiveCall('Temp Call');
			// this.cordovaCall.mute();
			this.setAudioForCall();
			this._session
			.getUserMedia(this.mediaParams)
			.then((stream) => {
				console.log('stream got');
				this._session.attachMediaStream("localStream", stream, {
					muted: true,
					mirror: true,
				});

				this._session
				.join(this.order.meeting_id, parseInt(this.userDets.calling_id), this.userDets.name)
				.then(() => {
					// console.log('joined');
					this._session
					.leave()
					.then(() => {
						this.joinToRoom()
					})
					.catch((error) => {
						console.log(error);
					});
				})
				.catch((error) => {
					console.log(error);
				});
			})
			.catch((error) => {
				console.log(error);
			});
		}
		catch(err){
			console.log(err);
			// setTimeout(() => {
				this.startCall()
			// }, 1000)
		}
	};

	stopCall = (userId = null) => {
		var message = {
			type: 'stop_call'
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(message));
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
  	};

  	onDevicesChangeListener = () => {
	    // if (iOS) return;

	    // ConnectyCube.videochat
      	// .getMediaDevices("videoinput")
      	// .then((mediaDevices) => {
	    //     this.mediaDevicesIds = mediaDevices?.map(({ deviceId }) => deviceId);

	    //     if (this.mediaDevicesIds.length < 2 || this._session.callType === ConnectyCube.videochat.CallType.AUDIO) {
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
	    iceState
  	) => {
	    // console.log(
	    //   "[onSessionConnectionStateChangedListener]",
	    //   userID,
	    //   connectionState
	    // );

		console.log('RCE: ', iceState);
		// if(iceState == 'disconnected'){
		// 	// setTimeout(() => {
				
		// 		this.restartICE();
		// 	// }, 5000);
		// }
	    // if(iceState == 'disconnected'){
	    	// this.stopCall();
	    	// this.startCall();
	    // }

  	};

  	async reconnectVideo(){
  		
  	}

  	setActiveDeviceId = (stream) => {
    	
  	};
	setAudioMute = () => {

	};

  	restartICE = () => {
		this._session
		.leave()
		.then(() => {
			this._session = null;
		})
		.catch((error) => {
			console.log(error);
		});
  	};

  	setVideoMute = () => {
	    
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
    	// if(this.platform.is('cordova') && this.platform.is('android')){
			// cordova.plugins.RingtonePlayer.play();
		// }
  	};

  	hideIncomingCallModal = () => {
  		this._incomingCallModal("hide");
  		this.hideCallNotification();
    	// if(this.platform.is('cordova') && this.platform.is('android')){
			// cordova.plugins.RingtonePlayer.stop();
		// }
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
  		this._onCallModal("hide");
		this.cordovaCall.endCall();
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
		console.log(id);
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
			ConnectyCube.logout().catch((error) => {});
          	axios.defaults.headers.common['Authorization'] = 'Bearer ';
			this.router.navigate(['/login']);
			// ConnectyCube.destroySession().catch((error) => {});
		});
	}

}