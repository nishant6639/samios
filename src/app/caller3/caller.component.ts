import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';

import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import OneSignal from 'onesignal-cordova-plugin';

declare let cordova:any;
declare let ConnectyCube;
declare let AudioToggle:any;

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
	selector: 'app-caller3',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {

	mediaParams:any = {
	    audio: true,
	    video: true,
	    elementId: "localStream",
	    options: {
	      muted: true,
	      mirror: true,
	    },
  	};
  	calleesIds:any = [];
  	incoming:any = 0;
  	on_call:any = 0;
  	dialing:any = 0;
  	video_loading:any = 1;
  	userDets:any = {};
  	callToEnd:any;
  	connected:any = 0;
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

	order:any = {};
	other_user:any = {};

  	constructor(
  		private misc:MiscService,
  		private call:CallService,
  		private api:ApiService,
  		private router:Router,
  		private _ngZone:NgZone,
  		private platform:Platform
	) {
		this.call.initCall(this.callInit.bind(this));
  	}

  	// ngAfterViewInit() {
  		// alert('asdasd');
  	// }

  	ngAfterViewInit(){
  		this.platform.ready()
  		.then(() => {
  			if(this.platform.is('ios')){
  				cordova.plugins.iosrtc.registerGlobals();
			}
			setTimeout(() => {
				this.initCallService();
				this.OneSignalInit();
			}, 2000);
  		})
  		.catch(err => {

  		});
  		// .then(() => {
  		// });
		// this.listenEvents();
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
				reconnectionTimeInterval:0,
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

      	this.userDets = this.misc.getUserDets();
  		let user = {
		  	password: "supersecurepwd",
		  	email: this.userDets.email
		};
      	ConnectyCube.createSession(user)
        .then(() => {
        	ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" });
    	})
        .then(() => {
        	this.listenEvents();
			this.connected = 1;
          	// this.$loginScreen.classList.add("hidden");
          	// this.$callScreen.classList.remove("hidden");
          	// this.$loader.classList.add("hidden");
          	// this.$caption.classList.remove("hidden");
          	// resolve();
        })
        .catch((err) => {

        });
  	};

  	checkInternetConection(){

  	}

  	async reInitCallService(){
		
		try {
			console.log('destroy previous instance of connectycube');
			// ConnectyCube.logout()
	      	// .then(async () => {
		        // await ConnectyCube.chat.disconnect();
	  		await ConnectyCube.destroySession();
		        // this.store$.dispatch(logout());
		        // this.cleanTokenAndNavigateToLoginScreen();
	      	// })
	      	// .catch((error: any) => {
		        // console.error(error);
	      	// });
		  	// await ConnectyCube.chat.disconnect();
		  	// await ConnectyCube.destroySession();
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

		try{
			let CREDENTIALS = {
			  	appId: 6798,
			  	authKey: "KbVKtzAQvPFAdtw",
			  	authSecret: "zrXRtdLamjF7fmq"
			};

			let CONFIG = {
				// chat: {
				//     reconnectionTimeInterval: 1,
				//     ping: {
				//       enable: true,
				//       timeInterval: 1
				//     }
					// reconnectionTimeInterval:0,
			  	// },
				// videochat: {
				// 	alwaysRelayCalls: false,
				//     answerTimeInterval: 600,
				    // dialingTimeInterval: 5
			    // },
			  	debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
			};

	  		ConnectyCube.init(CREDENTIALS, CONFIG);
	  		this.userDets = this.misc.getUserDets();
	  		let user = {
			  	password: "supersecurepwd",
			  	email: this.userDets.email
			};
	      	ConnectyCube.createSession(user)
	        .then(() => {
	        	ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" });
	    	})
	        .then(() => {
	  			this.listenEvents();
				this.connected = 1;
	          	// this.$loginScreen.classList.add("hidden");
	          	// this.$callScreen.classList.remove("hidden");
	          	// this.$loader.classList.add("hidden");
	          	// this.$caption.classList.remove("hidden");
	          	// resolve();
	        })
	        .catch((err) => {
	        	setTimeout(() => {
	        		this.reInitCallService();
	        	}, 5000);
	        });
        }
        catch(err) {
        	console.log(err);
        	setTimeout(() => {
        		this.reInitCallService();
        	}, 5000);
        }
  	}

  	logout = () => {
	    ConnectyCube.chat.disconnect();
	    ConnectyCube.destroySession();

	    // this.$callScreen.classList.add("hidden");
	    // this.$loginScreen.classList.remove("hidden");
  	};

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
			      		// if(this.appOpen == 0){
			      		// 	this.overlayMsg = "Waiting for Incoming Call";
		      			// }
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
			      		// if(this.appOpen == 0){
			      		// 	this.overlayMsg = "Accepting Call. Please Wait..";
		      			// }
			      		this.acceptCall();
			      	}

			      	if(clickAction == 'decline'){
			      		// this.rejectCallBack(noteData.notification.additionalData);
			      		// if(this.appOpen == 0){
			      		// 	this.overlayMsg = "Rejecting Call. Please Wait..";
		      			// }
			      	}

			      	if(clickAction == 'end_call'){
			      		this.stopCall();
			      	}

			  	});

			  	OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {
					// this.appOpen = 1;
					var data = notificationReceivedEvent.notification.additionalData;
					// console.log(notificationReceivedEvent.notification);
					// if(!(data == undefined)){
						// if(data.type == 'incoming_call'){
							// notificationReceivedEvent.complete(notificationReceivedEvent.notification);
						// }
						// else{
							// notificationReceivedEvent.complete(notificationReceivedEvent.notification);
						// }
					// }
					// else{
						notificationReceivedEvent.complete(null);
					// }
					
					// this.receiveMessages(notificationReceivedEvent.notification.additionalData);
				});
			}
		});
	}


  	listenEvents(){
  		this.platform.ready().then(() => {
  			try{
				document.addEventListener("offline", () => {
					this._ngZone.run(() => {
						this.onInternetDisconnected();
					});
				}, false);

				document.addEventListener("online", () => {
					this._ngZone.run(() => {
						this.onInternetReconnected();
					});
				});
				window.ononline = () => {
					this._ngZone.run(() => {
						this.onInternetReconnected();
					});
				    // alert('You are now online');
				}

				window.onoffline = () => {
				    // alert('You are now offline');
				    this._ngZone.run(() => {
						this.onInternetDisconnected();
					});
				}
			}
			catch(err){
				console.log(err);
			}

			try{
				ConnectyCube.chat.onDisconnectedListener = undefined;
				ConnectyCube.videochat.onCallListener = undefined;
		    	ConnectyCube.videochat.onAcceptCallListener = undefined;
		    	ConnectyCube.videochat.onRejectCallListener = undefined;
		    	ConnectyCube.videochat.onStopCallListener = undefined;
		    	ConnectyCube.videochat.onUserNotAnswerListener = undefined;
		    	ConnectyCube.videochat.onRemoteStreamListener = undefined;
		    	ConnectyCube.videochat.onDevicesChangeListener = undefined;
				ConnectyCube.videochat.onSessionConnectionStateChangedListener = undefined;
				ConnectyCube.chat.onReconnectListener = undefined;
			}
			catch(err){
				console.log(err);
			};

	  		ConnectyCube.chat.onDisconnectedListener = this.onDisconnectedListener.bind(this);
			ConnectyCube.videochat.onCallListener = this.onCallListener.bind(this);
	    	ConnectyCube.videochat.onAcceptCallListener = this.onAcceptCallListener.bind(this);
	    	ConnectyCube.videochat.onRejectCallListener = this.onRejectCallListener.bind(this);
	    	ConnectyCube.videochat.onStopCallListener = this.onStopCallListener.bind(this);
	    	ConnectyCube.videochat.onUserNotAnswerListener = this.onUserNotAnswerListener.bind(this);
	    	ConnectyCube.videochat.onRemoteStreamListener = this.onRemoteStreamListener.bind(this);
	    	ConnectyCube.videochat.onDevicesChangeListener = this.onDevicesChangeListener.bind(this);
			ConnectyCube.videochat.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener.bind(this);
			ConnectyCube.chat.onReconnectListener = this.onReconnectListener.bind(this);
			// document.getElementById("call-modal-reject")
	      	// .addEventListener("click", () => this.rejectCall());
		    // document.getElementById("call-modal-accept")
	      	// .addEventListener("click", () => this.acceptCall());

		});
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
			this.reInitCallService();
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
	    return this.api.getOrderDetails(data)
	    .then(resp => {
	    	console.log(resp);
	    	this.order = resp.data.order;
	    	this.other_user = resp.data.user;
	    	if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
			this.calleesIds = [this.other_user.calling_id]; // User's ids
	        // this.setCallLog(this.userDets.id, 'init_call', new Date());
	    	this.startVideoCall();
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
		// alert('asd');
	    if (session.initiatorID === session.currentUserID) {
	      return false;
	    }

	    if (this._session) {
	    	console.log('extres', extension.resume);
	    	if(extension.resume == 1){
	    		this._session = session;
	    		this.acceptCall();
	    		return false;
	    	}
	    	else{
		      	this.rejectCall(session, { busy: true });
		      	return false;
	      	}
	    }

	    if(extension.resume == 1){
    		this._session = session;
    		this.acceptCall();
    		return false;
    	}

	    this._session = session;
	    this.order = extension.order;
		this.other_user = extension.other_user;
		this.callToEnd = extension.callToEnd;

	    this.showIncomingCallModal();
	};

	onAcceptCallListener = (session, userId, extension) => {
		
	    if (userId === session.currentUserID) {
	      if (this.incoming == 1) {
	        this._session = null;
	        this.hideIncomingCallModal();
	        this.hideOutgoingCallModal();
	        this.showOnCallModal();
	        this.showSnackbar("You have accepted the call on other side");
	      }
	      return false;
	    } else {
	      	
	      	const userName = this._getUserById(userId, "name");
	      	const infoText = `${userName} has accepted the call`;
	      	this.showSnackbar(infoText);
	        this.hideOutgoingCallModal();
        	this.showOnCallModal();
      		// this.$dialing.pause();
	    }

	    // this.on_call = 1;
	    // this.showOnCallModal();
	};

	onRejectCallListener = (session, userId, extension:any = {}) => {
	    if (userId === session.currentUserID) {
	      if (this.$modal.classList.contains("show")) {
	        this._session = null;
	        this.hideIncomingCallModal();
	        this.showSnackbar("You have rejected the call on other side");
	      }

	      return false;
	    } else {
	      const userName = "name";
	      const infoText = extension.busy
	        ? `${userName} is busy`
	        : `${userName} rejected the call request`;

	      this.stopCall(userId);
	      this.showSnackbar(infoText);
	    }
	};


	onStopCallListener = (session, userId, extension) => {
	    if (!this._session) {
	      return false;
	    }
	    if (extension.resume == 1) {
	      return false;
	    }
	    
	    // this._ngZone.run(() => {
	    	this.hideOnCallModal();
		    this.hideIncomingCallModal();
    		this.hideOutgoingCallModal();
	    // });

	    const isStoppedByInitiator = session.initiatorID === userId;
	    const userName = this._getUserById(userId, "name");
	    const infoText = `${userName} has ${
	      isStoppedByInitiator ? "stopped" : "left"
	    } the call`;

	    this.showSnackbar(infoText);

	    if (isStoppedByInitiator) {
	      // if (this.$modal.classList.contains("show")) {
	        // this.hideIncomingCallModal();
	      // }
	      this.stopCall();
	    } else {
	      this.stopCall(userId);
	    }
  	};

  	onUserNotAnswerListener = (session, userId) => {
	    if (!this._session) {
	      return false;
	    }

	    // const userName = this._getUserById(userId, "name");
	    const infoText = `user did not answer`;

	    // this.showSnackbar(infoText);
	    this.stopCall(userId);
  	};

  	onRemoteStreamListener = (session, userId, stream) => {
	    if (!this._session) {
	      return false;
	    }

	    let remoteStreamSelector = `remoteStream`;
		// stop tracks
      	let remote_video:any = document.getElementById("remoteStream");
      	if(!(remote_video.srcObject == undefined || remote_video.srcObject == null)){
	      	for(let track of remote_video.srcObject.getTracks()) {
	        	track.stop();
	      	}
	  	}
	    // document.getElementById(`videochat-stream-loader-${userId}`).remove();
	    this._session.attachMediaStream(remoteStreamSelector, stream);

	    // this.$muteUnmuteButton.disabled = false;
	    // this.onDevicesChangeListener();
	    this._prepareVideoElement(remoteStreamSelector);
  	};


  	acceptCall = () => {
	    const extension = {};
	    const { opponentsIDs, initiatorID, currentUserID, callType } = this._session;
	    this.defaultSettings();
	    // this.hideIncomingCallModal();
	    const mediaOptions = {...this.mediaParams};
	    if (callType === ConnectyCube.videochat.CallType.AUDIO) {
	      delete mediaOptions.video;
	    }
	    
	    // stop tracks
      	const video:any = document.getElementById("localStream");
      	if(!(video.srcObject == undefined || video.srcObject == null)){
	      	for(const track of video.srcObject.getTracks()) {
	        	track.stop();
	      	}
	  	}
	  	
	  	// // stop tracks
      	// const remote_video:any = document.getElementById("remoteStream");
      	// if(!(remote_video.srcObject == undefined || remote_video.srcObject == null)){
	    //   	for(const track of remote_video.srcObject.getTracks()) {
	    //     	track.stop();
	    //   	}
	  	// }

	    if(this.platform.is('ios')){
			this.setAudioForCall();
		}
	    this._session.getUserMedia(mediaOptions).then((stream) => {
	      	this._session.accept(extension);
	      	this.showOnCallModal();
	      	this.hideIncomingCallModal();
	      	this.setActiveDeviceId(stream);
	      	this._prepareVideoElement("localStream");
	    });
  	};

  	setAudioForCall = async () => {

		await cordova.plugins.iosrtc.initAudioDevices();
		await cordova.plugins.iosrtc.selectAudioOutput('speaker');
		await cordova.plugins.iosrtc.turnOnSpeaker(true);
		await AudioToggle.setAudioMode('speaker');
  	};

  	rejectCall = (session, extension = {}) => {
	    if (session) {
	      session.reject(extension);
	    } else {
	      this._session.reject(extension);
	      this._session = null;
	      this.hideIncomingCallModal();
	    }
  	};

  	startAudioCall = () => {
	    this.startCall(ConnectyCube.videochat.CallType.AUDIO)
  	}

  	startVideoCall = () => {
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
				'session_id': 21321
				// 'session_id': this._session.ID
			};
			this.api.sendCallLog(data)
			.then(resp => {
				// console.log(resp);
			})
			.catch(err => {

			});
		}
	}

  	startCall = (callType, resume=0) => {
	    const options = {
	    	// maxBandwidth: 256
	    };
	    const opponents = this.calleesIds;
	    const opponentsIds = this.calleesIds;

	    this.defaultSettings();

	    if (opponents.length > 0) {
	      // document.getElementById("call").classList.add("hidden");
	      // document.getElementById("videochat").classList.remove("hidden");
	      // this.$dialing.play();
	      this.addStreamElements(opponents);
	      this._session = ConnectyCube.videochat.createNewSession(
	        opponentsIds,
	        callType,
	        options
	      );

	      console.log("startCall", {callType}, ConnectyCube.videochat.CallType.AUDIO)

	      const mediaOptions = {...this.mediaParams};
	      if (callType === ConnectyCube.videochat.CallType.AUDIO) {
	        delete mediaOptions.video;
	      }
	      //

		  	
		  	// stop tracks
	      this._session.getUserMedia(mediaOptions).then((stream) => {
	        // if (!this._session.getDisplayMedia || callType === ConnectyCube.videochat.CallType.AUDIO) {
	        //   this.$switchSharingScreenButton.disabled = true;
	        // }
	        // this.outgoing = 1;

		  	let extension = {
		  		order: this.order,
		  		other_user: this.userDets,
		  		callToEnd: this.callToEnd,
		  		resume: resume
		  	};
	        this._session.call(extension, (error) => {});
	        this.setActiveDeviceId(stream);
	        this._prepareVideoElement("localStream");
	      });

	      // send push notification when calling

	      // const currentUserName = this._getUserById(this._session.initiatorID, "name");
	      // const params = {
	      //   message: `Incoming call from ${currentUserName}`,
	      //   ios_voip: 1,
	      //   initiatorId: this._session.initiatorID,
	      //   opponentsIds: opponentsIds.join(","),
	      //   handle: currentUserName,
	      //   uuid: this._session.ID,
	      //   callType: callType === ConnectyCube.videochat.CallType.VIDEO ? "video" : "audio"
	      // };

	      // uncomment if you use Web <-> Flutter
	      // const params = {
	      //   message: `Incoming call from ${currentUserName}`,
	      //   ios_voip: 1,
	      //   caller_id: this._session.initiatorID,
	      //   call_opponents: opponentsIds.join(","),
	      //   caller_name: currentUserName,
	      //   session_id: this._session.ID,
	      //   call_type: callType,
	      //   signal_type: 'startCall'
	      // };
	      // const payload = JSON.stringify(params);
	      // const pushParameters = {
	      //   notification_type: "push",
	      //   user: { ids: opponentsIds },
	      //   message: ConnectyCube.pushnotifications.base64Encode(payload),
	      // };

	      // ConnectyCube.pushnotifications.events.create(pushParameters)
	      //   .then(result => {
	      //     console.log("[sendPushNotification] Ok");
	      //   }).catch(error => {
	      //     console.warn("[sendPushNotification] Error", error);
	      //   });

	    } else {
	      this.showSnackbar("Select at less one user to start Videocall");
	    }
	};

	stopCall = (userId = null) => {
	    const $callScreen = document.getElementById("call");
	    const $videochatScreen = document.getElementById("videochat");
	    const $muteButton = document.getElementById("videochat-mute-unmute");
	    const $videochatStreams = document.getElementById("videochat-streams");

	    if (userId) {
	      this.stopCall();
	    } else if (this._session) {
	      	// stop tracks
			const video:any = document.getElementById("localStream");
			if(!(video.srcObject == undefined || video.srcObject == null)){
				for(const track of video.srcObject.getTracks()) {
				track.stop();
				}
			}

			// stop tracks
			const remote_video:any = document.getElementById("remoteStream");
			if(!(remote_video.srcObject == undefined || remote_video.srcObject == null)){
				for(const track of remote_video.srcObject.getTracks()) {
				track.stop();
				}
			}

	      this._session.stop({});
	      ConnectyCube.videochat.clearSession(this._session.ID);
	      // this.$dialing.pause();
	      // this.$calling.pause();
	      // this.$endCall.play();
	      // this.$muteUnmuteButton.disabled = true;
	      // this.$switchCameraButton.disabled = true;
	      this._session = null;
	      this.mediaDevicesIds = [];
	      this.activeDeviceId = null;
	      this.isAudioMuted = false;
	      // this._ngZone.run(() => {

    		this.hideOutgoingCallModal();
    		this.hideOnCallModal();
    		this.hideIncomingCallModal();
	      // });
	      // $videochatStreams.innerHTML = "";
	      // $videochatStreams.classList.value = "";
	      // $callScreen.classList.remove("hidden");
	      // $videochatScreen.classList.add("hidden");
	      // $muteButton.classList.remove("muted");

	      // if (this.isSharingScreen) {
	      //   this.isSharingScreen = false;
	      //   this.updateSharingScreenBtn();
	      // }

	      // if (iOS) {
	      //   $videochatScreen.style.background = "#000000";
	      // }
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
	    userID,
	    connectionState
  	) => {
	    // console.log(
	    //   "[onSessionConnectionStateChangedListener]",
	    //   userID,
	    //   connectionState
	    // );

	    console.log('RCE: ', connectionState);

	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.UNDEFINED){
	    	console.log('RCE: UNDEFINED');
	    	// this.stopCall();
	    }

	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.FAILED){
	    	console.log('RCE: Failed');
	    	this.stopCall();
	    }


	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.CONNECTING){
	    	console.log('RCE: CONNECTING');
	    	this._ngZone.run(() => {
	    		this.video_loading = 1;
	    	});
	    	// this.stopCall();
	    }

	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.CONNECTED){
	    	this._ngZone.run(() => {
	    		this.video_loading = 0;
	    	});
	    	console.log('RCE: CONNECTED');
	    	// this.stopCall();
	    }

	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.DISCONNECTED){
	    	console.log('RCE: DISCONNECTED');
	    	// this.stopCall();

	      	let video:any = document.getElementById("localStream");
	      	if(!(video.srcObject == undefined || video.srcObject == null)){
		      	for(let track of video.srcObject.getTracks()) {
		        	track.stop();
		      	}
		  	}


	      	let remote_video:any = document.getElementById("remoteStream");
	      	if(!(remote_video.srcObject == undefined || remote_video.srcObject == null)){
		      	for(let track of remote_video.srcObject.getTracks()) {
		        	track.stop();
		      	}
		  	}
    		this.video_loading = 1;
    		
    		let extension = {
    			resume: 1
    		};
      		this._session.stop(extension);
      		ConnectyCube.videochat.clearSession(this._session.ID);
      		this._session = null;

	    	if((this.connected == 1)){
	    		this.calleesIds = [this.other_user.calling_id]; // User's ids
	    		this.reconnectVideo();
    		}
	    }


	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.CLOSED){
	    	console.log('RCE: CLOSED');
	    }



	    if(connectionState == ConnectyCube.videochat.SessionConnectionState.COMPLETED){
	    	console.log('RCE: COMPLETED');
	    }

  	};

  	async reconnectVideo(){
  		// stop tracks
  		// let extension = {
		// 	resume: 1
		// };
  		// this._session.stop(extension);
  		// ConnectyCube.videochat.clearSession(this._session.ID);
  		// this._session = null;
  		try {
			console.log('destroy previous instance of connectycube');
			// ConnectyCube.logout()
	      	// .then(async () => {
		        // await ConnectyCube.chat.disconnect();
	  		await ConnectyCube.destroySession();
		        // this.store$.dispatch(logout());
		        // this.cleanTokenAndNavigateToLoginScreen();
	      	// })
	      	// .catch((error: any) => {
		        // console.error(error);
	      	// });
		  	// await ConnectyCube.chat.disconnect();
		  	// await ConnectyCube.destroySession();
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

		// try{
			let CREDENTIALS = {
			  	appId: 6798,
			  	authKey: "KbVKtzAQvPFAdtw",
			  	authSecret: "zrXRtdLamjF7fmq"
			};

			let CONFIG = {
				// chat: {
				//     reconnectionTimeInterval: 1,
				//     ping: {
				//       enable: true,
				//       timeInterval: 1
				//     }
					// reconnectionTimeInterval:0,
			  	// },
				// videochat: {
				// 	alwaysRelayCalls: false,
				//     answerTimeInterval: 600,
				    // dialingTimeInterval: 5
			    // },
			  	debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
			};

	  		ConnectyCube.init(CREDENTIALS, CONFIG);
	  		this.userDets = this.misc.getUserDets();
	  		let user = {
			  	password: "supersecurepwd",
			  	email: this.userDets.email
			};
	      	ConnectyCube.createSession(user)
	        .then(() => {
	        	ConnectyCube.chat.connect({ userId: this.userDets.calling_id, password: "supersecurepwd" })
	        	.then(() => {
	  				this.startCall(ConnectyCube.videochat.CallType.VIDEO, 1);
		          	// this.$loginScreen.classList.add("hidden");
		          	// this.$callScreen.classList.remove("hidden");
		          	// this.$loader.classList.add("hidden");
		          	// this.$caption.classList.remove("hidden");
		          	// resolve();
		        })
		        .catch((err) => {
		        	setTimeout(() => {
		        		this.reconnectVideo();
		        	}, 5000);
		        });;
	    	})
	        .catch((err) => {
	        	setTimeout(() => {
	        		this.reconnectVideo();
	        	}, 5000);
	        });
        // }
        // catch(err) {
        // 	console.log(err);
        // 	// setTimeout(() => {
        // 		// this.reconnectVideo();
        // 	// }, 5000);
        // }

  	}

  	setActiveDeviceId = (stream) => {
    	// if (stream) {
	    //   	const videoTracks = stream.getVideoTracks();
	    //   	const videoTrackSettings = videoTracks[0]?.getSettings();

	    //   	this.activeDeviceId = videoTrackSettings?.deviceId;
	    // }
  	};

  	setAudioMute = () => {
	    // const $muteButton = document.getElementById("videochat-mute-unmute");

	    if (this.isAudioMuted) {
	      this._session.unmute("audio");
	      this.isAudioMuted = false;
	      // $muteButton.classList.remove("muted");
	    } else {
	      this._session.mute("audio");
	      this.isAudioMuted = true;
	      // $muteButton.classList.add("muted");
	    }
  	};

  	setVideoMute = () => {
	    // const $muteButton = document.getElementById("videochat-mute-unmute");

	    if (this.isVideoMuted) {
	      this._session.unmute("video");
	      this.isVideoMuted = false;
	      // $muteButton.classList.remove("muted");
	    } else {
	      this._session.mute("video");
	      this.isVideoMuted = true;
	      // $muteButton.classList.add("muted");
	    }
  	};

  	switchCamera = () => {
	    const mediaDevicesId = this.mediaDevicesIds.find(
	      (deviceId) => deviceId !== this.activeDeviceId
	    );

	    this._session.switchMediaTracks({ video: mediaDevicesId }).then(() => {
	      this.activeDeviceId = mediaDevicesId;

	      if (this.isAudioMuted) {
	        this._session.mute("audio");
	      }
	    });
	};


	sharingScreen = () => {
	    // if (!this.isSharingScreen) {
	    //   return this._session
	    //     .getDisplayMedia(this.sharingScreenMediaParams, true)
	    //     .then(
	    //       (stream) => {
	    //         this.updateStream(stream);
	    //         this.isSharingScreen = true;
	    //         this.updateSharingScreenBtn();
	    //         this.startEventSharinScreen = stream
	    //           .getVideoTracks()[0]
	    //           .addEventListener("ended", () => this.stopSharingScreen());
	    //       },
	    //       (error) => {
	    //         console.warn("[Get display media error]", error, this.mediaParam);
	    //         this.stopSharingScreen();
	    //       }
	    //     );
	    // } else {
	    //   this.stopSharingScreen();
	    // }
	};

	updateSharingScreenBtn = () => {
	    // const $videochatSharingScreen = document.getElementById(
	    //   "videochat-sharing-screen"
	    // );
	    // const $videochatSharingScreenIcon = document.getElementById(
	    //   "videochat-sharing-screen-icon"
	    // );

	    // if (this.isSharingScreen) {
	    //   $videochatSharingScreen.classList.add("videochat-sharing-screen-active");
	    //   $videochatSharingScreenIcon.classList.add(
	    //     "videochat-sharing-screen-icon-active"
	    //   );
	    // } else {
	    //   $videochatSharingScreen.classList.remove(
	    //     "videochat-sharing-screen-active"
	    //   );
	    //   $videochatSharingScreenIcon.classList.remove(
	    //     "videochat-sharing-screen-icon-active"
	    //   );
	    // }
	};

	stopSharingScreen = () => {
	    // return this._session.getUserMedia(this.mediaParams, true).then((stream) => {
	    //   this.updateStream(stream);
	    //   this.isSharingScreen = false;
	    //   this.updateSharingScreenBtn();
	    //   this.startEventSharinScreen = null;
	    // });
  	};

  	updateStream = (stream) => {
	    this.setActiveDeviceId(stream);
	    this._prepareVideoElement("localStream");
  	};

  	/* SNACKBAR */

  	showSnackbar = (infoText) => {
  		console.log(infoText);
	    // const $snackbar = document.getElementById("snackbar");

	    // $snackbar.innerHTML = infoText;
	    // $snackbar.classList.add("show");

	    // setTimeout(function () {
	      // $snackbar.innerHTML = "";
	      // $snackbar.classList.remove("show");
	    // }, 3000);
  	};


  	/*OUTGOING CALL MODAL */

  	showOutgoingCallModal = () => {
  		this._outgoingCallModal("show");
  	};

  	hideOutgoingCallModal = () => {
  		this._outgoingCallModal("hide");
  	};


  	_outgoingCallModal = (className) => {
	    
	    if (className === "hide") {
	    	this.dialing = 0;
	    } else {
	    	this.dialing = 1;
	    }
  	};

  	

  	/*INCOMING CALL MODAL */

  	showIncomingCallModal = () => {
  		this._incomingCallModal("show");
    	this.showIncomingNotification();
    	if(this.platform.is('cordova') && this.platform.is('android')){
			cordova.plugins.RingtonePlayer.play();
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
  		this._onCallModal("show");
  		this.showOngoingCallNotification();
  	};

  	hideOnCallModal = () => {
  		this._onCallModal("hide");
  		this.hideCallNotification();
  	};

  	_onCallModal = (className) => {

	    if (className === "hide") {
	    	this.on_call = 0;
	    } else {
	    	this.on_call = 1;
	    }

  	};


  	_getUserById = (userId, key) => {
  		return "dummyName";
	    // const user = users.find((user) => user.id == userId);

	    // return typeof key === "string" ? user[key] : user;
  	};

  	_prepareVideoElement = (videoElement) => {
	    const $video:any = document.getElementById(videoElement);

	    // $video.style.visibility = "visible";

	    // if (iOS) {
	    //   document.getElementById("videochat").style.background = "transparent";
	    //   $video.style.backgroundColor = "";
	    //   $video.style.zIndex = -1;
	    // }
  	};

  	muteSound = () => {

  	};
	muteVideo = () => {

  	};



}
