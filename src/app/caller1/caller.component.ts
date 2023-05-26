declare var Peer;
import { Component, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, NgZone } from '@angular/core';
// import Peer from 'peerjs';
import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx/';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ConnectivityProvider } from '../../utils/connectivity.provider';
import { FirebaseService } from '../services/firebase.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import OneSignal from 'onesignal-cordova-plugin';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
declare let cordova:any;
declare let AudioToggle:any;

@Component({
	selector: 'app-caller1',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {

	activeScreen:any = 2;
	comm:any;
	audio_muted:any = 0;
	video_muted:any = 0;
	soundMode:any = 0;
	backbutton:any;
	orderId:any = 0;
	userId:any = 0;
	splashShown:any = 0;
	myUserId:any;
	callCl:any; // For cloning incoming and outgoing calls.
	myStream:any;
	answering:any = 0;
	connId:any = 0;
	conn:any = null;
	callToEnd:any = null;
	peer:typeof Peer;
	// peer:any;
	timeIntStarted:any = 0;
	remTime:any = "";
	bookingRequest:any = "";
	chatMsgs:any = [];
	callLog:any = [];
	newChat:any = 0;
	reconInt:any;
	itemRefSub:any;
	reconnecting:any = 0;
	itemRef: AngularFireObject<any>;
	noteRef: AngularFireObject<any>;
	callRef: AngularFireObject<any>;
	chatWin:any = 0;
	appState:any = 1;
	message:any = "";
	userDets:any = null;
	lastUser:any = null;
	adminNewMsg:any = 0;
	rtcConn:any;
	my_user:any;
	order:any = {};
	my_role:any = "";
	other_user:any;
	myScreen:any;
	callStartTime:any;
	callerScreen:any;
	outgoingCall:any;
	outgoingCallData:any;
	incomingCallData:any;
	remoteStream:any;
	defVolume:any = 0;
	callExtended:any = 0;
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
	callExtendShown:any = 0;
	callExtendRequest:any = 0;
	callExtendRequested:any = 0;
	connectionstate:any = "";
	callStage:any = 0;
	showCancel:any = 0;
	timeInt:any;
	rem_text:any;
	myStreamEn:any = 0;
	remoteStreamEn:any = 0;
	minutes:any;
	seconds:any;
	ongoingCall:any = "";
	connected:any = 0;
	retry_attempts = 0;
	noteRefSub:any;
	auto_answer:any = 0;
	// options:any = {  // not used, by default it'll use peerjs server
	// 	// host: 'peer.samantapp.com',
	// 	// port:'9000',
	// 	pingInterval:10,
	// 	secure: true,
	// 	debug: 3,
	// 	config: { 
	// 		'iceServers': [
	// 			{ 'urls': ["stun:bn-turn1.xirsys.com"] },
	// 			{
	// 				urls: [
	// 		       		"turn:bn-turn1.xirsys.com:80?transport=udp",
	// 		       		"turn:bn-turn1.xirsys.com:3478?transport=udp",
	// 		       		"turn:bn-turn1.xirsys.com:80?transport=tcp",
	// 		       		"turn:bn-turn1.xirsys.com:3478?transport=tcp",
	// 		       		"turns:bn-turn1.xirsys.com:443?transport=tcp",
	// 		       		"turns:bn-turn1.xirsys.com:5349?transport=tcp"
	// 		   		],
	// 				credential: '603f5686-ed48-11ec-b6a9-0242ac140004',
	// 				credentialType: "password",
	// 				username: '2vi9xx4UwdLUwienMJ9A5Wx7yp1rJ6_wFDT8U2tw9TqpEXyJyJdlkzCLNgvdWXg7AAAAAGKq37xuaXNoYW50NjYzOQ=='
	// 			},
	// 			// 	{
	// 			// 		urls: 'turn:numb.viagenie.ca',
	// 			// 		credential: 'September@06',
	// 			// 		username: 'nishant.2011in@gmail.com'
	// 			// 	},
	// 		],
 //  			iceTransportPolicy: "relay",
 //  			'sdpSemantics': 'unified-plan'
 //  		}
	// };

	// options:any = {  // not used, by default it'll use peerjs server
	// 	// host: 'peer.samantapp.com',
	// 	// port:'9000',
	// 	pingInterval:100,
	// 	secure: true,
	// 	debug: 3,
	// 	config: { 'iceServers': [
	// 		{ 'urls': 'stun:stun.l.google.com:19302' },
	// 		{
	// 			urls: 'turn:turn.samantapp.com',
	// 			credential: 'Samthecat202003',
	// 			username: 'samantapp'
	// 		},
	// 		// {
	// 		// 	urls: 'turn:numb.viagenie.ca',
	// 		// 	credential: 'September@06',
	// 		// 	username: 'nishant.2011in@gmail.com'
	// 		// },
	// 	], 'sdpSemantics': 'unified-plan'}
	// };

	options:any = {  // not used, by default it'll use peerjs server
		// host: 'peer.samantapp.com',
		// port:'9000',
		pingInterval:100,
		secure: true,
		debug: 1,
		config: { 
			'iceServers': [],
			'sdpSemantics': 'unified-plan'
		}
	};

	// differ: KeyValueDiffer<string, any>;
	constructor(private call:CallService,
		private api:ApiService,
		private misc:MiscService,
		private router: Router,
		// private peer: Peer,
		private androidPermissions: AndroidPermissions,
		private diagnostic: Diagnostic,
		private connectivityProvider:ConnectivityProvider,
		public audioman: AudioManagement,
    	private backgroundMode: BackgroundMode,
		private firebase:FirebaseService,
		private platform: Platform,
		private _ngZone: NgZone,
		private nativeAudio: NativeAudio,
		// private localNotifications: LocalNotifications,
		private db: AngularFireDatabase, private insomnia: Insomnia) {

	}

	ngAfterViewInit() {
		
		this.platform.ready().then(() => {
			if (this.platform.is('cordova') && this.platform.is('ios')) {
				cordova.plugins.iosrtc.registerGlobals();
				// this.loadCallS = 1;
			}

			this.lookForConnectivityChanges();
			this.comm = this.call.comm;
			
			this.firebase.initProviderBooking(this.showAcceptToast.bind(this));

			this.firebase.initIncoming(this.incomingCall.bind(this));

			this.firebase.initReceiver(this.receiverEnabled.bind(this));

			this.firebase.initReceiveMsg(this.receiveFireMsg.bind(this));

			this.firebase.initSendCallMsg(this.sendCallMsgs.bind(this));
			
			this.call.initChatData(this.getChatData.bind(this));

			this.call.initCall(this.callInit.bind(this));

			this.call.initDestroy(this.callDestroy.bind(this));

			// if (this.platform.is('cordova')) {
			//     cordova.plugins.backgroundMode.enable();

			//     cordova.plugins.backgroundMode.on("activate", ()=>{

			//       // console.log('enable');
			//       this.appState = 0;
			//       cordova.plugins.backgroundMode.disableWebViewOptimizations();
			//     });
			//     cordova.plugins.backgroundMode.on("deactivate", ()=>{
			//       	// console.log('disable');
			//       	this.appState = 1;
			//       	if (this.platform.is('cordova') && this.platform.is('ios')) {
			//  			setTimeout(()=>{
			// 				cordova.plugins.iosrtc.refreshVideos();
			// 			}, 500);
			//  		}
			//     });
		 //    }
		    
		    this.userDets = this.misc.getUserDets();
	    	
	    	// console.log('sdfsdfsfsdfsdfds', this.userDets);

	    	this.initUser();

			this.router.events.forEach((event) => {
				// console.log('sdfsdf');
		      	if(event instanceof NavigationEnd) {

					console.log('nav end');

		        	this.userDets = this.misc.getUserDets();

		        	this.initUser();

		        	this.getPopupEvents();

		      	}
		    });
	    });
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

	initUser(){
		
		if(!(this.userDets == null || this.userDets == undefined || this.userDets.id == undefined)) {
			if(!(this.lastUser == null)){
				if(this.userDets.id == this.lastUser.id){
					console.log('Same user. Skipping Initialize.');
				}
				else{
					console.log('User changed. Initializing peer.');
					this.peerInit();
				}
			}
			else{
				console.log('New Instance. Initializing peer.');
				this.peerInit();
			}
		}
		else{
			// if(this.splashShown == 0){
			// 	let splash:any = document.getElementById('splashScreen');
			// 	splash.style.display = "block";
			// 	setTimeout(()=>{
			// 		// this.splash = 1;
			// 		splash.style.display = "none";
			// 		this.splashShown = 1;
			// 	}, 4000);
			// }
			console.log('user undefined');
		}

	}

	getDeviceLists(){
		navigator.mediaDevices.enumerateDevices()
	    .then((devices) => {
	      devices.forEach((device) => {
	      	console.log(device);
	        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
	      });
	    })
	    .catch((err) => {
	      console.error(`${err.name}: ${err.message}`);
	    });
	}

	peerInit(){
		this.getDeviceLists();
		navigator.mediaDevices.ondevicechange = (event) => {
			console.log(event);
		  	this.getDeviceLists();
		};
		// this.peer = new Peer('SamantaPJSS'+this.userDets.id, this.options);
		this.lastUser = this.userDets;
		// this.peer.on('open', (id) => {
		// 	this.waitForCall();
		// });
		// this.waitForCall();
		this.platform.ready().then(() => {
			if (this.platform.is('cordova')) {
				this.OneSignalInit();
			}
			this.receiveMessage();
		});
	}

	OneSignalInit(){

		

		// if(this.platform.is('cordova')){
			// OneSignal.removeExternalUserId();
		// }
		// let externalUserId = 'samnote'+this.userDets.id;

	  	// OneSignal.setExternalUserId(externalUserId);

		OneSignal.setNotificationOpenedHandler((jsonData:any) => {
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
	      		if(this.callStage == 2){
	      			this.answerCall();
	      		}
	      		else{
	      			this.auto_answer = 1;
	      		}
	      	}

	      	if(clickAction == 'decline'){
	      		setTimeout(() => {
	      			if(this.callStage == 2){
		      			this.disconnectMyCall();
		      		}
	      		});
	      	}

	      	if(clickAction == 'end_call'){
	      		setTimeout(() => {
	      			if(this.callStage == 3){
		      			this.disconnectMyCall();
		      		}
	      		});
	      	}

	  	});


		OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {
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

	heartbeat () {
        if ( this.peer.socket._wsOpen() ) {
            this.peer.socket.send( {type:'HEARTBEAT'} );
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
					if(message.type == 'incoming_call'){
						this.bringAppToForeground();
						this.playRingtone();
						this.order = message.order;
						this.other_user = message.other_user;
						let msg = {
							'type': 'ringing'
						};

						this.sendCallMsgs(this.other_user.id, JSON.stringify(msg));

						// this.nat = message.nat;
						this.options['config']['iceServers'] = message.ice_servers;
						this.showIncomingCallScreen();
					}

					if(message.type == 'ringing'){
						if(this.callStage == 1){
							console.log('ringing');
							this.callStage = 4;
						}
					}

					if(message.type == 'receiver_ready'){
						console.log('receiver_ready');
						if(this.callStage == 1 || this.callStage == 4){
							// this.callStage = 4;
							// this.showIncomingCallScreen();
							this.proceedWithOutgoingCall();
						}
						else{
							// Graciously ignored receiver enabled.
						}
					}

				    if(message.type == "order_accepted"){
					console.log('useracc', this.firebase.UserAcceptFn);
				    	if(!(this.firebase.UserAcceptFn == undefined)){
				    		this.firebase.UserAcceptFn();
				    	}
					console.log('userwait', this.firebase.UserWaitFn);
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
					// get disconnect signal from other user.
				    if(message.type == 'disconnect'){
				    	// if(this.callStage > 0){
							this.disconnectCall();
						// }
						// else{
							// Graciously ignored receiver enabled.
						// }
						// conn.close();
					}

					// if(message.type == 'ringing'){
					// 	if(this.callStage == 1){
					// 		this.callStage = 4;
					// 	}
					// }

				    if(message.type == "audio_muted"){
				    	this.remote_audio_muted = message.value;
				    }

				    if(message.type == "video_muted"){
				    	this.remote_video_muted = message.value;
				    }
				    
				    this.sendCallMsgs(this.userDets.id, "");
				} else {
					// if(this.splashShown == 0){
					// 	let splash:any = document.getElementById('splashScreen');
					// 	splash.style.display = "block";
					// 	setTimeout(()=>{
					// 		// this.splash = 1;
					// 		splash.style.display = "none";
					// 		this.splashShown = 1;
					// 	}, 4000);
					// }
				}
			});
		}
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

	async getLocalVideoTracksDo(){
		let video_perm = true;
		let audio_perm = true;

		if(this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))) {
			
			console.log('sdfsfsfsadas');
			await cordova.plugins.diagnostic.getCameraAuthorizationStatus({
			    successCallback: function(status){
			        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
			            console.log("Camera use is authorized");
			        }
			        else{
			        	console.log("Camera use is unauthorized");
			        }
			    },
			    errorCallback: function(error){
			        console.error("The following error occurred: "+error);
			    },
			    externalStorage: false
			});
			// await this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS]);

			// await this.diagnostic.getCameraAuthorizationStatus()
			// .then(status => {
		    //     if(status === this.diagnostic.permissionStatus.GRANTED){
		    //         console.log("Camera use is authorized");
	        //     	video_perm = true;
			//   	}
			//   	else{
			//   		video_perm = false;
			//   	}
		  	// })
		    // .catch(error => {
		    //     console.error("The following error occurred: "+error);
		    // });
			    // externalStorage: false
			// });

			// await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
			// .then(result => {
			//   	console.log('Has camera permission?',result.hasPermission);
			//   	if(result.hasPermission == false){
			//   		video_perm = false;
			//   	}
			//   	else{
			//   		video_perm = false;
			//   	}
			//   	// this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
		  	// })
			// .catch(err => {
			// 	// this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
			// });

			// await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
			// .then(result => {
			//   	console.log('Has audio permission?',result.hasPermission);
			//   	if(result.hasPermission == false){
			//   		video_perm = false;
			//   	}
			//   	else{
			//   		video_perm = true;
			//   	}
			//   	// this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
		  	// })
			// .catch(err => {
			// 	// this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
			// });

			await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
			  result => console.log('Has modify permission?',result.hasPermission),
			  err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
			);
		}

		this.myScreen = document.getElementById('myVideo');
		// this.myScreen.muted = "true";
		console.log('abcd');
			// alert('showing self feed');
		navigator.mediaDevices.getUserMedia({ audio: audio_perm, video: video_perm })
		.then((stream) => {
			console.log('efgh');
			this.myStream = stream;
			this.myScreen.muted = "true";
			this.myScreen.srcObject = this.myStream;

			// this.callStage = 1; // Caller connecting
			this.remote_audio_muted = 0;
			this.remote_video_muted = 0;

			if (this.platform.is('cordova') && this.platform.is('ios')) {
				// var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				var elements:any = document.getElementsByClassName('ion-page');
				Array.from(elements).forEach((el:any) => {
				    // Do stuff here
				    el.style.display = "none";
				});
				var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				element1.style.background = "transparent";
				// var elements2:any = document.getElementsByClassName('popup');
				// elements2.forEach(element => {
				// 	element.style.display = "none";
				// });
				this.refreshVideos();
	      	}

	      	// this.startCallMid(order_id, 0);
      	})
		.catch((error) => {
			alert('error');
			console.log(error);
			// this.handleError(error);
		});
	}

	async getLocalVideoTracks(){
		this.platform.ready().then(async() => {
			await this.getLocalVideoTracksDo();
		});
		return;
	}

	async connectToPeerServer(){
		if(this.peer == undefined){
			this.peer = await new Peer('SamantaPJSS'+this.userDets.id, this.options);
			this.peer.on('open', () => {
				this.waitForAutoAnswer();
				// this.reconnecting = 0;
				// if(!(this.reconInt == undefined)) {
				// 	clearInterval(this.reconInt);
				// }
			});

			this.peer.on('error', (err) => {
				console.log('peeeeer errrror', err.type);
				if(err.type == 'network'){
					this.peer.reconnect();
				}
				// if(this.connected == 1){
				// 	this.reconnecting = 1;
				// 	this.reconInt = setInterval(() => {
				// 		if(this.reconnecting == 1){
				// 			this.peer.reconnect();
				// 		}
				// 	}, 5000);
				// }
			});
		}
		else{
			this.peer.destroy();
			this.peer = await new Peer('SamantaPJSS'+this.userDets.id, this.options);
			this.peer.on('open', () => {
				this.waitForAutoAnswer();
				this.reconnecting = 0;
				if(!(this.reconInt == undefined)) {
					clearInterval(this.reconInt);
				}
			});
			this.peer.on('error', (err) => {
				console.log('peeeeer errrror', err.type);
				if(err.type == 'network'){
					this.peer.reconnect();
				}
				// if(this.connected == 1){
				// 	this.reconnecting = 1;
				// 	this.reconInt = setInterval(() => {
				// 		if(this.reconnecting == 1){
				// 			this.peer.reconnect();
				// 		}
				// 	}, 5000);
				// }
			});
		}
	}

	async callerConnectToPeerServer(){
		if(this.peer == undefined){
			this.peer = await new Peer('SamantaPJSS'+this.userDets.id, this.options);
			this.peer.on('open', () => {
				this.doOutgoingCall();
				// this.waitForAutoAnswer();
			});
		}
		else{
			this.peer.destroy();
			this.peer = await new Peer('SamantaPJSS'+this.userDets.id, this.options);
			this.peer.on('open', () => {
				this.doOutgoingCall();
				// let message = {
				// 	'type': 'receiver_ready'
				// };

				// this.sendCallMsgs(this.other_user.id, JSON.stringify(message));
			
			});
		}
	}

	async callInit(order_id){
		await this.getLocalVideoTracks();
		this.callStage = 1;
		this.playDialer();
		var data = {
	      	'order_id': order_id
	    };
		this.api.startCallInit(data)
		.then(resp => {
			console.log(resp);
			this.order = resp.data.order;
			this.setCallLog(this.userDets.id, 'init_call', new Date());
			this.other_user = resp.data.other_user;
			this.options['config']['iceServers'] = resp.data.nat.ice_servers;
			let message = {
				type: 'incoming_call',
				order: this.order,
				other_user: this.userDets,
				ice_servers: resp.data.nat.ice_servers
			};
			this.sendCallMsgs(this.other_user.id, JSON.stringify(message));
			// if(resp.order.
			// this.sendCallMsgs()
		})
		.catch(err => {

		});
		// this.sendCallMsgs(id, message);
	}

	async proceedWithOutgoingCall(){
		await this.callerConnectToPeerServer();
	}

	doOutgoingCall(){
		this.callCl = this.peer.call('SamantaPJSS'+this.other_user.id, this.myStream);
		this.my_role = 'dialer';
		this.remoteParticipantAdded();
		// this.waitForAutoAnswer();
	}

	async showIncomingCallScreen(){
		await this.getLocalVideoTracks();
		this.callStage = 2;
		if(this.auto_answer == 1){
			this.answerCall();
		}
	}

	async answerCall(){
		this.auto_answer = 0;
		if(this.answering == 0){
			this.answering = 1;
			await this.connectToPeerServer();
		}
		// this.waitForAutoAnswer();

	}
	
	waitForAutoAnswer(){
		this.peer.on('call', (call) =>{
			this.my_role = 'receiver';
			this.callCl = call;
			this.callCl.answer(this.myStream);
			this.remoteParticipantAdded();
		});
		this.setCallLog(this.userDets.id, 'received', new Date());
		// setTimeout(() => {

			let message = {
				'type': 'receiver_ready'
			};

			this.sendCallMsgs(this.other_user.id, JSON.stringify(message));
		// }, 1000);
	}

	tryReconnection(){
		// await this.connectToPeerServer();
	}

	waitForReconnection(){
		// await this.connectToPeerServer();
	}

	checkForReconnections(){
		this.rtcConn.onconnectionstatechange = (event) => {
			console.log(event.target);
			this.connectionstate = event.target.connectionState;
			
			if(this.connectionstate == 'disconnected'){
				this.reconnecting = 1;
			}
			
			if(this.connectionstate == 'connected'){
				this.reconnecting = 0;
			}

			if(this.connectionstate == 'failed'){
				if(this.my_role == 'dialer'){
					this.disconnectMyCall();
				}
				if(this.my_role == 'receiver'){
					this.disconnectCall();
				}
			}
		};
		// this.peer.on('disconnected', () => {
		// 	if(this.connected == 1){
		// 		console.log('reconnecting');
		// 		setTimeout(() => {
		// 			this.peer.reconnect();
		// 		}, 5000);
		// 	}
		// });
	}

	remoteParticipantAdded(){
		let id = 0;
		this.backbutton = this.platform.backButton.observers.pop();
		this.callerScreen = document.getElementById('callerVideo');
		this.callCl.on('stream', (stream) => {
			if (id != stream.id) {
				console.log(stream.getTracks());
			}
			this.stopDialer();
			this.stopRingtone();
			this.getChatData();
			this.callStage = 3;
			this.answering = 0;
			this.activeScreen = 1;
			this.callStartTime = new Date();
			this.timeInt = setInterval(()=>{
				this.getRemainingTime();
			}, 1000);
			this.remoteStream = stream;
			this.callerScreen.srcObject = this.remoteStream;
			// this.callerScreen.muted = "true";
			this.connected = 1;
			this.rtcConn = this.callCl.peerConnection;
			this.checkForReconnections();
			if (this.platform.is('cordova') && this.platform.is('ios')) {
				var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				var elements:any = document.getElementsByClassName('ion-page');
				Array.from(elements).forEach((el:any) => {
				    // Do stuff here
				    el.style.display = "none";
				});
				var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				element1.style.background = "transparent";
				this.refreshVideos();
	      	}
		});
		this.callCl.on('error', (err) => {
			console.log(err);
			console.log(err.type);
		});
		this.callCl.on('close', () => {
			console.log('call closed');
			// console.log(err.type);
		});
	}

	lookForConnectivityChanges(){
		this.connectivityProvider.appIsOnline$.subscribe(online => {

		    // console.log(online)

		    if (online) {

		    	console.log('online');
		    	this.receiveMessage();
		        // call functions or methods that need to execute when app goes online (such as sync() etc)

		    } else {
		    	console.log('offline');
		        // call functions on network offline, such as firebase.goOffline()

		    }

		})
	}


	playRingtone(){
		setTimeout(() => {
			if(this.platform.is('cordova')){
				this.nativeAudio.loop('ringtone')
				.then(onSuccess => {}, onError => {});
			}
		}, 1000);
	}

	stopRingtone(){
		setTimeout(() => {
			if(this.platform.is('cordova')){
				this.nativeAudio.stop('ringtone')
				.then(onSuccess => {}, onError => {});
			}
		}, 1000);
			
	}

	playDialer(){
		setTimeout(() => {
			if(this.platform.is('cordova')){
				this.nativeAudio.loop('ringing')
				.then(onSuccess => {}, onError => {});
			}
		}, 1000);
			
	}


	stopDialer(){
		setTimeout(() => {
			if(this.platform.is('cordova')){
				this.nativeAudio.stop('ringing')
				.then(onSuccess => {}, onError => {});
			}
		}, 1000);
	}

	// sendCallMsgs(id, message){

	// 	//send call specific messages and instructions
	// 	var option = {
	// 		serialization:'json',
	// 		reliable: true
	// 	};

	// 	var conn = this.peer.connect('SamantaPJSS'+id, option);

	// 	// on open will be called when you successfully connect to PeerServer
	// 	conn.on('open', () => {
	// 	  	conn.send(message);
	// 	});
	// }

 	refreshVideos(){
 		this.platform.ready().then(() => {
 			if (this.platform.is('cordova') && this.platform.is('ios')) {
	 			// setTimeout(()=>{
					cordova.plugins.iosrtc.refreshVideos();
				// }, 500);
	 		};
 		});
 	}


	// To get order dets for receiving side

	getOrderDets(order_id){
		var data = {
	      	'order_id': order_id
	    };
	    return this.api.getOrderDetails(data)
	    .then(resp => {
	    	this.order = resp.data.order;
	    	if (this.platform.is('cordova')) {
		    	this.insomnia.keepAwake()
			  	.then(
				    () => console.log('success'),
				    () => console.log('error')
			  	);
		  	}
			if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
	    })
	    .catch(err => {

	    });
	}

	// initiate Outgoing call

	outGoingCall(order_id){
		this.callStage = 1; // Caller connecting
		if(this.platform.is('cordova')){
		
			this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
		   	.then((result) => {
		   		this.defVolume = result.volume;
		   		this.audioman.getMaxVolume(AudioManagement.VolumeType.MUSIC)
			   	.then((result1) => {
			    	this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, result1.maxVolume)
				   	.then(() => {
				    	
				   	})
				   	.catch((reason) => {
			     		
				   	});
			   	})
			   	.catch((reason) => {
		     		
			   	});
		   	})
		   	.catch((reason) => {
	     		console.log(reason);
		   	});
	   	}
		setTimeout(() => {
			if(this.platform.is('cordova')){
				this.nativeAudio.loop('ringing')
				.then(onSuccess => {}, onError => {});
			}
		}, 1000);

		this.remote_audio_muted = 1;
		this.remote_video_muted = 1;
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
		.then(stream => {
			this.myStream = stream;
			this.myScreen.srcObject = this.myStream;
			this.myScreen.muted = "true";
			var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
			
			if (this.platform.is('cordova') && this.platform.is('ios')) {
				var element:any = document.getElementsByClassName('ion-page')[0];
				element.style.display = "none";
				var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				element1.style.background = "transparent";
	            setTimeout(()=>{
					cordova.plugins.iosrtc.refreshVideos();
				}, 500);
	      	}

			this.callStage = 1; // Caller connecting
			this.remote_audio_muted = 0;
			this.remote_video_muted = 0;
	      	this.startCallMid(order_id, 0);
      	})
		.catch(error => {
			// this.handleError(error);
		});
	}

	startCallMid(order_id, retry){
		var data = {
			'order_id':order_id
		};
		this.api.startCall(data)
		.then(resp => {
			if (this.platform.is('cordova')) {
				this.insomnia.keepAwake()
			  	.then(
			    	() => console.log('success'),
			    	() => console.log('error')
			  	);
		  	}
			if(!(resp.data.end_time == null)){
				this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
			}
			this.order = resp.data.order;
			this.getChatData();
			this.other_user = resp.data.user;
			this.my_user = resp.data.my_user;
			this.myUserId = resp.data.my_user_id;
			var metadata = {
				'type': 'order',
				'order': this.order,
				'other_user': resp.data.my_user,
				'my_user': resp.data.other_user,
				'myUserId': this.other_user.id
			};

			if(retry == 0){
				this.setCallLog(resp.data.my_user_id, 'init_call', new Date());
			}
			this.startOutgoingCall(metadata);
		})
		.catch( err => {
			console.log(err);
			this.misc.handleError(err);
			this.disconnectCall()
		});
	}

	startOutgoingCall(metadata){
		// Start Outgoing Call
		var options = {
			metadata: metadata
		};
		this.ongoingCall = "";
		this.platform.ready().then(() => {
			if(this.platform.is('cordova') && this.platform.is('ios')){
				AudioToggle.setAudioMode(AudioToggle.SPEAKER);
			}
		});
		this.soundMode = 1;
		
		this.outgoingCallData = this.peer.call('SamantaPJSS'+this.other_user.id, this.myStream, options);

		// this.outgoingCallData.on('close', ()=>{
		// 	this.disconnectCall();
		// });


		let id=0;
		this.outgoingCallData.on('stream', (instream) => {
			this.nativeAudio.stop('ringing')
			.then(onSuccess => {}, onError => {});

			if (id != instream.id) {
				id = instream.id;
				// alert('incoming stream');
				this.remoteStream = instream;
				this.callerScreen.srcObject = this.remoteStream;
				this.callerScreen.muted = "true";

				if (this.platform.is('cordova') && this.platform.is('ios')) {
					var element:any = document.getElementsByClassName('ion-page')[0];
					element.style.display = "none";
					var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
					element1.style.background = "transparent";
		            setTimeout(()=>{
						cordova.plugins.iosrtc.refreshVideos();
					}, 500);
		      	}

				this.callStage = 3;
				this.activeScreen = 1;
				this.callStartTime = new Date();
				// if(this.timeIntStarted == 0){
				// 	this.timeIntStarted = 1;
				// 	this.timeInt = setInterval(()=>{
				// 		this.getRemainingTime();
				// 	}, 1000);
				// }
          	}
		});

	}

	callUser(id, order_id){
		this.ongoingCall = "";
	    this.call.call(id, order_id);
  	}

	callDestroy(){
		if(this.noteRefSub){
			console.log('unsubscribing firebase');
			this.noteRefSub.unsubscribe();
		}
		this.userDets = null;
		this.lastUser = null;
		// this.peer.destroy();
	}

	incomingCall(data){
		//Dead end
	}

	waitForCall(){
		this.peer.on('call', (call) => {
			this.platform.ready().then(() => {
				if(this.platform.is('cordova') && this.platform.is('ios')){
					AudioToggle.setAudioMode(AudioToggle.SPEAKER);
				}
			});
			// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
			this.soundMode = 1;

			if (this.platform.is('cordova')) {
				cordova.plugins.backgroundMode.moveToForeground();
			}
			
			var meta = call.metadata;
			
			this.order = meta.order;
			
			this.other_user = meta.other_user;
			
			this.my_user = meta.my_user;
			
			this.myUserId = meta.myUserId;
			
			this.getChatData();
			
			var call_message = {
				'type': 'ringing'
			};
			
			this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));

			this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
		   	.then((result) => {
		   		this.defVolume = result.volume;
		   		this.audioman.getMaxVolume(AudioManagement.VolumeType.MUSIC)
			   	.then((result1) => {
			    	this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, result1.maxVolume)
				   	.then(() => {
				    	
				   	})
				   	.catch((reason) => {
			     		
				   	});
			   	})
			   	.catch((reason) => {
		     		
			   	});
		   	})
		   	.catch((reason) => {
	     		console.log(reason);
		   	});
		   	setTimeout(() => {
		   		this.nativeAudio.loop('ringtone')
				.then(onSuccess => {}, onError => {});
		   	}, 1000);
			this.getIncomVideoFeed(call);
		});
	}

	getIncomVideoFeed(call){
		if(this.appState == 1){
			navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(stream => {
				this.incomingCallData = call;
				this.myStream = stream;
				this.myScreen.srcObject = this.myStream;
				this.myScreen.muted = "true";

				// if (this.platform.is('cordova') && this.platform.is('ios')) {
				// 	var element:any = document.getElementsByClassName('ion-page')[0];
				// 	element.style.display = "none";
				// 	var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
				// 	element1.style.background = "transparent";
		  //           setTimeout(()=>{
				// 		cordova.plugins.iosrtc.refreshVideos();
				// 	}, 500);
		  //     	}
				this.callStage = 2;
				this.ongoingCall = "";
			})
			.catch(error => {
				
			});
		}else{
			setTimeout(() => {
				this.getIncomVideoFeed(call);
			}, 2000);
		}
	}

	setActiveScreen(n){
		this.activeScreen = n;
		if (this.platform.is('cordova') && this.platform.is('ios')) {
			setTimeout(()=>{
				cordova.plugins.iosrtc.refreshVideos();
			}, 500);
      	}
	}

	answerCallBack(){
		
			this.incomingCallData.answer(this.myStream);
			console.log('stop1');
			let id=0;

			var receive_flag = 0;
			this.nativeAudio.stop('ringtone')
			.then(onSuccess => {}, onError => {});
			console.log('stop2');

			this.incomingCallData.on('stream', (stream) => {
			console.log('stop3');

				if (id != stream.id) {
					
					console.log('stop4');

					// console.log('audio', stream.getAudioTracks()[0]);
					if(receive_flag == 0){
						this.setCallLog(this.myUserId, 'received', new Date());
						receive_flag = 1;
					}
			console.log('stop5');

					
					id = stream.id;
					this.remoteStream = stream;
					this.callerScreen.srcObject = this.remoteStream;
			console.log('stop6');

					this.callStage = 3;
					this.activeScreen = 1;
			console.log('stop7');

					this.callStartTime = new Date();
					// if(this.timeIntStarted == 0){
					// 	this.timeIntStarted = 1;
					// 	this.timeInt = setInterval(()=>{
					// 		this.getRemainingTime();
					// 	}, 1000);
					// }

					if (this.platform.is('cordova') && this.platform.is('ios')) {
						setTimeout(()=>{
							cordova.plugins.iosrtc.refreshVideos();
						}, 500);
			      	}
				}
			});
		
	}



	receiverEnabled(){
		if(this.callStage == 0 ||this.callStage == 3 || this.callStage == 4){
			return;
		}
		
	}

	switchAudio(){
		if(this.soundMode == 0){
			this.platform.ready().then(() => {
				if(this.platform.is('cordova') && this.platform.is('ios')){
					AudioToggle.setAudioMode(AudioToggle.SPEAKER);
				}
			});
			// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
			this.soundMode = 1;
		}
		else{
			this.platform.ready().then(() => {
				if(this.platform.is('cordova') && this.platform.is('ios')){
					AudioToggle.setAudioMode(AudioToggle.EARPIECE);
				}
			});
			// AudioToggle.setAudioMode(AudioToggle.EARPIECE);
			this.soundMode = 0;
		}
	}

	muteUnmuteAudio(){
	
		this.audio_muted = (this.audio_muted == 0)?1:0;

		if(this.myStream != null && this.myStream.getAudioTracks().length > 0){
	    	
	    	if(this.audio_muted == 0){
	    		this.myStream.getAudioTracks()[0].enabled = true;
	    	}
	    	else{
	    		this.myStream.getAudioTracks()[0].enabled = false;
	    	}
	  	}

	  	var call_message = {
			'type': 'audio_muted',
			'value': this.audio_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));

	  	if (this.platform.is('cordova') && this.platform.is('ios')) {
            setTimeout(()=>{
				cordova.plugins.iosrtc.refreshVideos();
			}, 500);
      	}
	
	
	}

	muteUnmuteVideo(){

		this.video_muted = (this.video_muted == 0)?1:0;
		// this.call.muteVideo(this.video_muted);
		if(this.myStream != null && this.myStream.getVideoTracks().length > 0){
	    	
	    	if(this.video_muted == 0){
	    		this.myStream.getVideoTracks()[0].enabled = true;
	    	}
	    	else{
	    		this.myStream.getVideoTracks()[0].enabled = false;
	    	}
	  	}

	  	var call_message = {
			'type': 'video_muted',
			'value': this.video_muted
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));

	  	if (this.platform.is('cordova') && this.platform.is('ios')) {
            setTimeout(()=>{
				cordova.plugins.iosrtc.refreshVideos();
			}, 500);
      	}
	
	}


	disconnectMyCall(){
		this.stopRingtone();
		this.stopDialer();
		this.connected = 0;
		this.platform.backButton.observers.push(this.backbutton);
		let dis_call_stage = this.callStage;
		if(this.timeInt){
			clearInterval(this.timeInt);
		}
		if (this.platform.is('cordova')) {
			this.insomnia.allowSleepAgain()
		  	.then(
			    () => console.log('success'),
			    () => console.log('error')
		  	);
	  	}
		if(this.callStage == 2){
			this.setCallLog(this.userDets.id, 'declined', new Date());
		}
		if(this.callStage == 1){
			this.setCallLog(this.userDets.id, 'declined_before_connect', new Date());
		}
		if(this.callStage == 4){
			this.setCallLog(this.userDets.id, 'declined_after_connect', new Date());
		}
		if(this.callStage == 3){
			this.setCallLog(this.userDets.id, 'disconnected', new Date());
		}

		if(this.myStream && this.myStream.getTracks()){
			this.myStream.getTracks().forEach(track => {
				track.stop();
				this.myScreen.srcObject.removeTrack(track);
			})
		}
		
		if(this.remoteStream && this.remoteStream.getTracks()){
			this.remoteStream.getTracks().forEach(track => {
				track.stop();
				this.callerScreen.srcObject.removeTrack(track);
			});
		}
		if(this.peer == undefined){}
		else{
			this.peer.destroy();
			this.peer = undefined;
		}
		var call_message = {
			'type': 'disconnect'
		};
		this.sendCallMsgs(this.other_user.id, JSON.stringify(call_message));

		console.log('disconnecting');

		if(this.callStage == 3){
			this.callStage = 0;
			this._ngZone.run(() => {
				this.router.navigate(['/summary/'+this.order.id]);
			});
		}else{
			this.callStage = 0;
		}
		this.resetAllCallData();

	}

	disconnectCall(){
		this.stopRingtone();
		this.stopDialer();
		// let dis_call_stage = this.callStage;
		// this.callStage = 0;
		this.connected = 0;

		if(!(this.timeInt == undefined)){
			clearInterval(this.timeInt);
		}
		if (this.platform.is('cordova')) {
			this.insomnia.allowSleepAgain()
		  	.then(
			    () => console.log('success'),
			    () => console.log('error')
		  	);
	  	}

		if(this.myStream){
			this.myStream.getTracks().forEach(track => track.stop())
		}
		
		if(this.remoteStream && this.remoteStream.getTracks()){
			this.remoteStream.getTracks().forEach(track => track.stop())
		}
		if(this.peer == undefined){}
		else{
			this.peer.destroy();
			this.peer = undefined;
		}
		if(this.callStage == 3){
			this.callStage = 0;
			this._ngZone.run(() => {
				this.router.navigate(['/summary/'+this.order.id]);
			});
		}else{
			this.callStage = 0;
		}
		this.resetAllCallData();
	}

	resetAllCallData(){
		// ================================================
		// Reset Everything
		// ================================================
		// setTimeout(() => {
			// this.connId = null;
			// this.conn = null;
		// }, 1000);
		this.answering = 0;
		this.callStage = 0;
		if(this.itemRef){
			this.itemRefSub.unsubscribe();
		}
		if(this.platform.is('cordova') && this.platform.is('ios')){
			// this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.defVolume)
		 //   	.then(() => {
		    	
		 //   	})
		 //   	.catch((reason) => {
	     		
		 //   	});
	   	}

		// this.nativeAudio.stop('ringtone')
		// .then(onSuccess => {}, onError => {});
		// this.nativeAudio.stop('ringing')
		// .then(onSuccess => {}, onError => {});
		this.platform.ready().then(() => {
			// if(this.platform.is('cordova') && this.platform.is('ios')){
			// 	AudioToggle.setAudioMode(AudioToggle.SPEAKER);
			// }
		});
		// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
		this.soundMode = 0;
		this.timeIntStarted = 0;
		this.callExtendRequest = 0;
		this.callExtendRequested = 0;
		this.callExtendShown = 0;
		this.callExtended = 0;
		this.showCancel = 0;
		this.chatWin = 0;
		this.callCl = undefined;
		this.reconInt = undefined;
		this.activeScreen = 2;
		this.newChat = 0;
		this.audio_muted = 0;
		this.video_muted = 0;
		this.remote_audio_muted = 0;
		this.remote_video_muted = 0;
		this.callToEnd = null;
		var elements:any = document.getElementsByClassName('ion-page');
		Array.from(elements).forEach((el:any) => {
		    // Do stuff here
		    el.style.display = "flex";
		});
		// var element:any = document.getElementsByClassName('ion-page')[0];
		// element.style.display = "flex";
		var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
		element1.style.background = "#000";
		document.querySelector('#remText').innerHTML = "";
		document.querySelector('#remMin').innerHTML = "";
		document.querySelector('#remSec').innerHTML = "";
		document.querySelector('#remText1').innerHTML = "";
		document.querySelector('#remMin1').innerHTML = "";
		document.querySelector('#remSec1').innerHTML = "";
		document.querySelector('#remText2').innerHTML = "";
		document.querySelector('#remMin2').innerHTML = "";
		document.querySelector('#remSec2').innerHTML = "";
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

	sendFireMsg(msg){
		var data = {
			'user_id' : this.other_user.id,
			'msg': msg,
			'order_id': this.order.id
		};
		this.api.sendFireMsg(data)
		.then(resp => {
			// // console.log(resp);
		})
		.catch(err => {
			// // console.log(err);
		})

	}

	receiveFireMsg(msg){
		
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
				'order_id': this.order.id
			};
			this.api.sendCallLog(data)
			.then(resp => {
				// console.log(resp);
			})
			.catch(err => {

			});
		}
	}


	showAcceptToast(order){
		var data = order;
		data['date'] = (new Date((data['date']+" UTC").replace(/-/g, '/'))).toISOString();
		this.bookingRequest = data;
	}

	cancelOrder(order_id){
		var data = {
			cancel_type: 2,
			order_id: this.order.id
		};
		this.api.cancelOrder(data)
		.then(resp => {
			this.misc.showToast('Order Cancelled succesfully');
			this.disconnectMyCall();
		})
		.catch(err => {
			// // console.log(err);
			this.misc.handleError(err);
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
	getRemainingTime(){
		this.refreshVideos();	
		var endTime = new Date((this.order.to_time+" UTC").replace(/-/g, '/'));
		var total = endTime.getTime() - new Date().getTime();
		
		var timeNow = new Date().getTime() - this.callStartTime.getTime();
		var time_passed = timeNow/1000;
		if(time_passed > 60){
			this.showCancel = 0;
		}
		else{
			this.showCancel = 1;
		}

		if(total < 0 && this.callExtended == 0){
			clearInterval(this.timeInt);
			if(!(this.userDets.user_type == 3)){
				this.disconnectMyCall();
				return;
			}
		}
		else{
			if(!(this.callToEnd == null)){
				if(((new Date()).toISOString()) >= this.callToEnd){
					clearInterval(this.timeInt);
					if(!(this.userDets.user_type == 3)){
						this.disconnectMyCall();
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
			
			if(minutes < 2 && this.order.user_id == this.myUserId && this.callExtendShown == 0){
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

}