declare var Peer;
import { Component, AfterViewInit, DoCheck, KeyValueDiffers, KeyValueDiffer, NgZone } from '@angular/core';
// import Peer from 'peerjs';
import { MiscService } from '../services/misc.service';
import { CallService } from '../services/call.service';
import { ApiService } from '../services/api.service';
import { Platform } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import OneSignal from 'onesignal-cordova-plugin';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
declare let cordova: any;
declare let AudioToggle:any;
import * as Video from 'twilio-video';
// declare const twiliovideo: TwilioVideoPlugin;
@Component({
	selector: 'app-caller',
	templateUrl: './caller.component.html',
	styleUrls: ['./caller.component.scss'],
})
export class CallerComponent implements AfterViewInit {
	// twiliovideo: any = (window as any).twiliovideo;
	activeScreen:any = 2;
	comm:any;
	audio_muted:any = 0;
	video_muted:any = 0;
	soundMode:any = 0;
	orderId:any = 0;
	userId:any = 0;
	myUserId:any;
	myStream:any;
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
	itemRef: AngularFireObject<any>;
	callRef: AngularFireObject<any>;
	chatWin:any = 0;
	appState:any = 1;
	message:any = "";
	userDets:any = [];
	adminNewMsg:any = 0
	my_user:any;
	order:any = {};
	other_user:any;
	myScreen:any;
	callStartTime:any;
	callerScreen:any;
	outgoingCall:any;
	outgoingCallData:any;
	incomingCallData:any;
	remoteStream:any;
	room:any;
	defVolume:any = 0;
	callExtended:any = 0;
	remote_audio_muted:any = 0;
	remote_video_muted:any = 0;
	callExtendShown:any = 0;
	callExtendRequest:any = 0;
	callExtendRequested:any = 0;
	callStage:any = 0;
	showCancel:any = 0;
	timeInt:any;
	rem_text:any;
	myStreamEn:any = 0;
	remoteStreamEn:any = 0;
	minutes:any;
	seconds:any;
	ongoingCall:any = "";
	options:any = {  // not used, by default it'll use peerjs server
		// host: 'peer.samantapp.com',
		// port:'9000',
		pingInterval:100,
		secure: true,
		debug: 3,
		config: { 
			'iceServers': [
				{ 'urls': ["stun:bn-turn1.xirsys.com"] },
				{
					urls: [
			       		"turn:bn-turn1.xirsys.com:80?transport=udp",
			       		"turn:bn-turn1.xirsys.com:3478?transport=udp",
			       		"turn:bn-turn1.xirsys.com:80?transport=tcp",
			       		"turn:bn-turn1.xirsys.com:3478?transport=tcp",
			       		"turns:bn-turn1.xirsys.com:443?transport=tcp",
			       		"turns:bn-turn1.xirsys.com:5349?transport=tcp"
			   		],
					credential: '603f5686-ed48-11ec-b6a9-0242ac140004',
					credentialType: "password",
					username: '2vi9xx4UwdLUwienMJ9A5Wx7yp1rJ6_wFDT8U2tw9TqpEXyJyJdlkzCLNgvdWXg7AAAAAGKq37xuaXNoYW50NjYzOQ=='
				},
				// 	{
				// 		urls: 'turn:numb.viagenie.ca',
				// 		credential: 'September@06',
				// 		username: 'nishant.2011in@gmail.com'
				// 	},
			],
  			iceTransportPolicy: "relay",
  			'sdpSemantics': 'unified-plan'
  		}
	};
	constructor(
		private call:CallService,
		private api:ApiService,
		// private oneSignal:OneSignal,
		private misc:MiscService,
		private router: Router,
		public audioman: AudioManagement,
    	private firebase:FirebaseService,
		private platform: Platform,
		private _ngZone: NgZone,
		private nativeAudio: NativeAudio,
		private localNotifications: LocalNotifications,
		private db: AngularFireDatabase, private insomnia: Insomnia) {

	}

	ngAfterViewInit() {

		// Video.openRoom('xyx', 'xyz');
		// Video.connect('$TOKEN', { name:'my-new-room' }).then(room => {
		//   console.log(`Successfully joined a Room: ${room}`);
		//   room.on('participantConnected', participant => {
		//     console.log(`A remote Participant connected: ${participant}`);
		//   });
		// }, error => {
		//   console.error(`Unable to connect to Room: ${error.message}`);
		// });
		
		this.platform.ready().then(() => {
			this.comm = this.call.comm;
			// this.myScreen = document.getElementById('myVideo');
			// this.myScreen.muted = "true";
			// this.callerScreen = document.getElementById('callerVideo');
			
			
		    this.userDets = this.misc.getUserDets();

			if(this.platform.is('cordova')){
				
				if(!(this.userDets.id == undefined)){
					this.OneSignalInit();
				}
			
			}
			
			this.firebase.initProviderBooking(this.showAcceptToast.bind(this));

			// this.firebase.initIncoming(this.incomingCall.bind(this));

			// this.firebase.initReceiver(this.receiverEnabled.bind(this));

			// this.firebase.initReceiveMsg(this.receiveFireMsg.bind(this));

			// this.firebase.initSendCallMsg(this.sendCallMsgs.bind(this));
			
			// this.call.initChatData(this.getChatData.bind(this));

			this.call.initCall(this.callInit.bind(this));

			// this.call.initDestroy(this.callDestroy.bind(this));
	    	
	    	console.log('sdfsdfsfsdfsdfds', this.userDets);

	    	// this.initUser();

			this.router.events.forEach((event) => {
				// console.log('sdfsdf');
		      	if(event instanceof NavigationEnd) {

					console.log('nav end');
		        	this.userDets = this.misc.getUserDets();

		        	// this.initUser();

		        	this.getPopupEvents();

		      	}
		    });
	    });
	}

	OneSignalInit(){
		// this.oneSignal.startInit("c9b34fe5-7aa3-47e6-864e-a526a56333d7", 'sfsdfd');
	 //  	this.oneSignal.handleNotificationReceived().subscribe((data) => {
		//  	// do something when notification is received
		//  	console.log(data);
		// });

		// this.oneSignal.handleNotificationOpened().subscribe((data) => {
		//   	// do something when a notification is opened
		//  	console.log(data);
		// });
		OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
		
		let externalUserId = 'samnote'+this.userDets.id;

		// OneSignal.push(() => {
		  	OneSignal.setExternalUserId(externalUserId);
		// });

		OneSignal.setNotificationOpenedHandler(function(jsonData) {
	      	console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
	  	});


		OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent:any) => {

			console.log(notificationReceivedEvent.notification);
		  // notificationReceivedEvent.complete(notificationReceivedEvent.notification);
		});


	}

	callUser(id, order_id){
		// this.ongoingCall = "";
	    this.call.call(id, order_id);
  	}

  	callInit(order_id){
		// this.outGoingCall(order_id);
		var data = {
			'order_id':order_id
		};
		this.api.startCallInit(data)
		.then(resp => {
			this.callActStart(order_id, resp.data.room_sid)
		})
		.catch(err => {

		});
	}

	callActStart(order_id, token){
		Video.createLocalTracks({
		  	audio: true,
		  	video: { width: 800, height: 1600 }
		}).then(localTracks => {
			console.log(localTracks);
			this.callStage = 1;
			const localMediaContainer = document.getElementById('myVideoDivIn');
			localMediaContainer.innerHTML = "";
			localTracks.map((tracks:any) => {
				localMediaContainer.appendChild(tracks.attach());
			});
		  	return Video.connect(token, {
		    	name: "callRoom"+order_id,
		    	tracks: localTracks
		  	});
		}).then(room => {
		  	console.log(`Successfully joined a Room: ${room}`);
		  	this.room = room;
		  	this.handleRoomEvents();
		});
		// Video.connect(token, {
		// 	name: "callRoom"+order_id
		// 	audio: true,
	 //  		// video: { width: 640 }
	 //  		video: false
		// })
		// .then(room => {
		//   console.log(`Successfully joined a Room: ${room}`);
		//   room.on('participantConnected', participant => {
		//     console.log(`A remote Participant connected: ${participant}`);
		//   });
		// })
		// .catch(error => {
		//   console.error(`Unable to connect to Room: ${error.message}`);
		// });
	}


	handleRoomEvents(){
		this.room.on('participantConnected', participant => {
		    // console.log(`A remote Participant connected: ${participant}`);
		    this.callStage = 3;
		    console.log(`Participant "${participant.identity}" connected`);
			const remoteMediaContainer = document.getElementById('callerVideoDivIn');
			remoteMediaContainer.innerHTML = "";
		    // console.log(participant.tracks);
			participant.tracks.forEach(publication => {
				console.log(publication);
				// if(!publication.track == null){
				// 	remoteMediaContainer.appendChild(publication.track.attach());
				// }
				// if (publication.isSubscribed) {
				  	// const track = publication.track;
				  	// document.getElementById('callerVideoDivIn').appendChild(track.attach());
				// }
			});
			participant.on('trackSubscribed', track => {
			    remoteMediaContainer.appendChild(track.attach());
		  	});
	  	});

	  	this.room.participants.forEach(participant => {
		  	console.log(`Participant "${participant.identity}" is connected to the Room`);
		  	this.callStage = 3;
		  	const remoteMediaContainer = document.getElementById('callerVideoDivIn');

		    // console.log(participant.tracks);
			participant.tracks.forEach(publication => {
				console.log(publication);
				if(!publication.track == null){
					remoteMediaContainer.appendChild(publication.track.attach());
				}
				// if (publication.isSubscribed) {
				  	// const track = publication.track;
				  	// document.getElementById('callerVideoDivIn').appendChild(track.attach());
				// }
			});
			participant.on('trackSubscribed', track => {
			    remoteMediaContainer.appendChild(track.attach());
		  	});
		});

	  	this.room.on('participantDisconnected', participant => {
		  	// console.log(`Participant disconnected: ${participant.identity}`);
		  	// participant.tracks.forEach(publication => {
		   //  	const attachedElements = publication.track.detach();
		   //  	attachedElements.forEach(element => element.remove());
		  	// });
		  	this.room.localParticipant.tracks.forEach(publication => {
		    	const attachedElements = publication.track.detach();
		    	publication.track.stop();
		    	attachedElements.forEach(element => element.remove());
		  	});
		  	this.callStage = 0;
		  	this.disconnectMyCall();
		});

		this.room.on('reconnecting', error => {
		  // assert.equal(room.state, 'reconnecting');
		  if (error.code === 53001) {
		    console.log('Reconnecting your signaling connection!', error.message);
		  } else if (error.code === 53405) {
		    console.log('Reconnecting your media connection!', error.message);
		  }
		  /* Update the application UI here */
		});

		this.room.on('reconnected', () => {
		  	// assert.equal(room.state, 'connected');
		  	console.log('Reconnected your signaling and media connections!');
		  	/* Update the application UI here */
		});

		this.room.on('participantReconnecting', remoteParticipant => {
		  	// assert.equals(remoteParticipant.state, 'reconnecting');
		  	console.log(`${remoteParticipant.identity} is reconnecting the signaling connection to the Room!`);
		  /* Update the RemoteParticipant UI here */
		});

		this.room.on('participantReconnected', remoteParticipant => {
		  	// assert.equals(remoteParticipant.state, 'connected');
		  	console.log(`${remoteParticipant.identity} has reconnected the signaling connection to the Room!`);
		  	/* Update the RemoteParticipant UI here */
		});

	  	this.room.on('disconnected', room_cl => {
		  // Detach the local media elements
		  console.log(room_cl.localParticipant);
		  room_cl.localParticipant.tracks.forEach(publication => {
		    const attachedElements = publication.track.detach();
		    publication.track.stop();
		    attachedElements.forEach(element => element.remove());
		  });
		  this.callStage = 0;
		});
	}

	disconnectMyCall(){
		console.log('disconnecting');
		this.room.disconnect();
	}

	setActiveScreen(n){
		this.activeScreen = n;
		// if (this.platform.is('ios')) {
		// 	setTimeout(()=>{
		// 		cordova.plugins.iosrtc.refreshVideos();
		// 	}, 500);
  //     	}
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

	// initUser(){
	// 	// console.log('calling_id', this.userDets.calling_id);
	// 	if(!(this.userDets == undefined)){
	// 		if(this.peer == undefined){
	// 			this.peer = new Peer('SamantaPJS'+this.userDets.calling_id, this.options);
	// 			// setTimeout( this.heartbeat, 5000 );
	// 			// this.peer.on('open', (id) => {
	// 			// 	this.waitForCall();
	// 			// });
	// 			// this.listenToPeerErrors();
	// 			this.receiveMessage();
	// 		}
	// 		else{
	// 			if(this.peer.id == 'SamantaPJS'+this.userDets.calling_id){
					
	// 			}
	// 			else{
	// 				this.peer.destroy();
	// 				this.peer = new Peer('SamantaPJS'+this.userDets.calling_id, this.options);
	// 		        // setTimeout( this.heartbeat, 5000 );
	// 				// this.peer.on('open', (id) => {
	// 				// 	this.waitForCall();
	// 				// });
	// 				// this.listenToPeerErrors();
	// 				this.receiveMessage();
	// 			}
	// 		}
	// 	}
	// 	else{
	// 		console.log('user undefined');
	// 	}

	// 	// this.platform.pause.subscribe(e => {
	// 	//   this.callDestroy();
	// 	// });

	// 	// this.platform.resume.subscribe(e => {
	// 	//   this.initUser();
	// 	// });

	// 	// window.addEventListener('beforeunload', () => {
	// 	//   this.callDestroy();
	// 	// });
	// }

	// heartbeat () {
 //        if ( this.peer.socket._wsOpen() ) {
 //            this.peer.socket.send( {type:'HEARTBEAT'} );
 //        }
 //    }

	// // makePeerHeartbeater (  ) {
	// //     var timeoutId = 0;
	// //     // Start 
	// //     heartbeat();
	// //     // return
	// //     return {
	// //         start : () => {
	// //             if ( timeoutId === 0 ) { heartbeat(); }
	// //         },
	// //         stop : () => {
	// //             clearTimeout( timeoutId );
	// //             timeoutId = 0;
	// //         }
	// //     };
	// // }

	// // listening to errors emitted by peerjs plugin
	// listenToPeerErrors(){
	// 	this.peer.on('error', (err) => {
	// 		console.log('errrrrrr', err.type);
	// 		if(err.type == 'peer-unavailable'){
	// 		// 	// alert('peer-unavailable');
	// 			if(this.callStage == 1){
	// 		// 		// var metadata = {
	// 		// 		// 	'type': 'order',
	// 		// 		// 	'order': this.order,
	// 		// 		// 	'other_user': this.my_user,
	// 		// 		// 	'myUserId': this.other_user.id
	// 		// 		// };
	// 				this.startCallMid(this.order.id, 1);
	// 			}
	// 		}
	// 	});

	// 	this.peer.on('disconnected', () => {
	// 		console.log('disconnected');
	// 		// this.disconnectMyCall();
	// 	});
	// }


	// receiveMessage(){
	// 	this.peer.on('connection', (conn) => {
	// 		//on data will be called when we receive a messsage
	// 	  	conn.on('data', (data) => {

	// 		    if(data == "new_msg"){
	// 		    	this.adminNewMsg = 1;
	// 		    }else{
	// 			    var message = JSON.parse(data);

	// 			    if(message.type == "audio_muted"){
	// 			    	this.remote_audio_muted = message.value;
	// 			    }

	// 			    if(message.type == "video_muted"){
	// 			    	this.remote_video_muted = message.value;
	// 			    }


	// 			    if(message.type == "order_accepted"){
	// 			    	if(!(this.firebase.UserAcceptFn == undefined)){
	// 			    		this.firebase.UserAcceptFn();
	// 			    	}
	// 			    	if(!(this.firebase.UserWaitFn == undefined)){
	// 			    		this.firebase.UserWaitFn(message.order)
	// 		    		}
	// 			    }
	// 			    if(message.type == "order_requested"){
	// 			    	if(!(this.firebase.UserAcceptFn == undefined)){
	// 			    		this.firebase.UserAcceptFn();
	// 		    		}
	// 			    	this.showAcceptToast(message.order)
	// 			    }
	// 			    // get incoming order details.
	// 			    if(message.type == 'order'){
	// 					this.order = message.order;
	// 					this.other_user = message.other_user;
	// 					this.my_user = message.my_user;
	// 					this.myUserId = message.myUserId;
	// 			    }

	// 			    // get disconnect signal from other user.
	// 			    if(message.type == 'disconnect'){
	// 					this.disconnectCall();
	// 					conn.close();
	// 				}

	// 				// get extension request offer from user.
	// 				if(message.type == "extension_requested"){
	// 					this.callExtendRequested = 1;
	// 				}

	// 				// get extention offer accepted from service provider. 
	// 				if(message.type == "extension_allowed"){
	// 					this.callExtended = 1;
	// 					this.misc.showToast('Service provider allowed extension of call.');
	// 				}
	// 				// get extension offer declined from service provider.
	// 				if(message.type == "extension_denied"){
	// 					this.callExtended = 0;
	// 					this.misc.showToast('Service provider denied extension of call.');
	// 				}

	// 				if(message.type == 'ringing'){
	// 					if(this.callStage == 1){
	// 						this.callStage = 4;
	// 					}
	// 				}
	// 			}

	// 	  	});
	// 	});
	// }

	// sendCallMsgs(id, message){

	// 	//send call specific messages and instructions
	// 	var option = {
	// 		serialization:'json',
	// 		reliable: true
	// 	};

	// 	var conn = this.peer.connect('SamantaPJS'+id, option);

	// 	// on open will be called when you successfully connect to PeerServer
	// 	conn.on('open', () => {
	// 	  	conn.send(message);
	// 	});
	// }

 	resetVideo(){
 		if (this.platform.is('ios')) {
 			setTimeout(()=>{
				cordova.plugins.iosrtc.refreshVideos();
			}, 500);
 		}
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

	// outGoingCall(order_id){
	// 	this.callStage = 1; // Caller connecting
	// 	this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
	//    	.then((result) => {
	//    		this.defVolume = result.volume;
	//    		this.audioman.getMaxVolume(AudioManagement.VolumeType.MUSIC)
	// 	   	.then((result1) => {
	// 	    	this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, result1.maxVolume)
	// 		   	.then(() => {
			    	
	// 		   	})
	// 		   	.catch((reason) => {
		     		
	// 		   	});
	// 	   	})
	// 	   	.catch((reason) => {
	     		
	// 	   	});
	//    	})
	//    	.catch((reason) => {
 //     		console.log(reason);
	//    	});
	// 	setTimeout(() => {
	// 		this.nativeAudio.loop('ringing')
	// 		.then(onSuccess => {}, onError => {});
	// 	}, 1000);

	// 	this.remote_audio_muted = 1;
	// 	this.remote_video_muted = 1;
	// 	navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	// 	.then(stream => {
	// 		this.myStream = stream;
	// 		this.myScreen.srcObject = this.myStream;
	// 		this.myScreen.muted = "true";
	// 		var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
			
	// 		if (this.platform.is('ios')) {
	// 			var element:any = document.getElementsByClassName('ion-page')[0];
	// 			element.style.display = "none";
	// 			var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
	// 			element1.style.background = "transparent";
	//             setTimeout(()=>{
	// 				cordova.plugins.iosrtc.refreshVideos();
	// 			}, 500);
	//       	}

	// 		this.callStage = 1; // Caller connecting
	// 		this.remote_audio_muted = 0;
	// 		this.remote_video_muted = 0;
	//       	this.startCallMid(order_id, 0);
 //      	})
	// 	.catch(error => {
	// 		// this.handleError(error);
	// 	});
	// }

	// startCallMid(order_id, retry){
	// 	var data = {
	// 		'order_id':order_id
	// 	};
	// 	this.api.startCall(data)
	// 	.then(resp => {
	// 		if (this.platform.is('cordova')) {
	// 			this.insomnia.keepAwake()
	// 		  	.then(
	// 		    	() => console.log('success'),
	// 		    	() => console.log('error')
	// 		  	);
	// 	  	}
	// 		if(!(resp.data.end_time == null)){
	// 			this.callToEnd = new Date((resp.data.end_time+" UTC").replace(/-/g, '/')).toISOString();
	// 		}
	// 		this.order = resp.data.order;
	// 		this.getChatData();
	// 		this.other_user = resp.data.user;
	// 		this.my_user = resp.data.my_user;
	// 		this.myUserId = resp.data.my_user_id;
	// 		var metadata = {
	// 			'type': 'order',
	// 			'order': this.order,
	// 			'other_user': resp.data.my_user,
	// 			'my_user': resp.data.other_user,
	// 			'myUserId': this.other_user.id
	// 		};

	// 		if(retry == 0){
	// 			this.setCallLog(resp.data.my_user_id, 'init_call', new Date());
	// 		}
	// 		this.startOutgoingCall(metadata);
	// 	})
	// 	.catch( err => {
	// 		console.log(err);
	// 		this.misc.handleError(err);
	// 		this.disconnectCall()
	// 	});
	// }

	// startOutgoingCall(metadata){
	// 	// Start Outgoing Call
	// 	var options = {
	// 		metadata: metadata
	// 	};
	// 	this.ongoingCall = "";
	// 	this.platform.ready().then(() => {
	// 		AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 	});
	// 	this.soundMode = 1;
		
	// 	this.outgoingCallData = this.peer.call('SamantaPJS'+this.other_user.calling_id, this.myStream, options);

	// 	this.outgoingCallData.on('close', ()=>{
	// 		this.disconnectCall();
	// 	});


	// 	let id=0;
	// 	this.outgoingCallData.on('stream', (instream) => {
	// 		this.nativeAudio.stop('ringing')
	// 		.then(onSuccess => {}, onError => {});

	// 		if (id != instream.id) {
	// 			id = instream.id;
	// 			// alert('incoming stream');
	// 			this.remoteStream = instream;
	// 			this.callerScreen.srcObject = this.remoteStream;
	// 			if (this.platform.is('ios')) {
	// 				setTimeout(()=>{
	// 					cordova.plugins.iosrtc.refreshVideos();
	// 				}, 1000);
	// 	      	}
	// 			this.callStage = 3;
	// 			this.activeScreen = 1;
	// 			this.callStartTime = new Date();
	// 			if(this.timeIntStarted == 0){
	// 				this.timeIntStarted = 1;
	// 				this.timeInt = setInterval(()=>{
	// 					this.getRemainingTime();
	// 				}, 1000);
	// 			}
 //          	}
	// 	});

	// }

	// callUser(id, order_id){
	// 	this.ongoingCall = "";
	//     this.call.call(id, order_id);
 //  	}

	// callDestroy(){
	// 	this.peer.destroy();
	// }

	// incomingCall(data){
	// 	//Dead end
	// }

	// waitForCall(){
	// 	this.peer.on('call', (call) => {
	// 		this.platform.ready().then(() => {
	// 			AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 		});
	// 		// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 		this.soundMode = 1;

	// 		if (this.platform.is('cordova')) {
	// 			cordova.plugins.backgroundMode.moveToForeground();
	// 		}
			
	// 		var meta = call.metadata;
			
	// 		this.order = meta.order;
			
	// 		this.other_user = meta.other_user;
			
	// 		this.my_user = meta.my_user;
			
	// 		this.myUserId = meta.myUserId;
			
	// 		this.getChatData();
			
	// 		var call_message = {
	// 			'type': 'ringing'
	// 		};
			
	// 		this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));
	// 		this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
	// 	   	.then((result) => {
	// 	   		this.defVolume = result.volume;
	// 	   		this.audioman.getMaxVolume(AudioManagement.VolumeType.MUSIC)
	// 		   	.then((result1) => {
	// 		    	this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, result1.maxVolume)
	// 			   	.then(() => {
				    	
	// 			   	})
	// 			   	.catch((reason) => {
			     		
	// 			   	});
	// 		   	})
	// 		   	.catch((reason) => {
		     		
	// 		   	});
	// 	   	})
	// 	   	.catch((reason) => {
	//      		console.log(reason);
	// 	   	});
	// 	   	setTimeout(() => {
	// 	   		this.nativeAudio.loop('ringtone')
	// 			.then(onSuccess => {}, onError => {});
	// 	   	}, 1000);
	// 		this.getIncomVideoFeed(call);
	// 	});
	// }

	// getIncomVideoFeed(call){
	// 	if(this.appState == 1){
	// 		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	// 		.then(stream => {
	// 			this.myStream = stream;
	// 			this.myScreen.srcObject = this.myStream;
	// 			this.myScreen.muted = "true";
	// 			if (this.platform.is('ios')) {
	// 				var element:any = document.getElementsByClassName('ion-page')[0];
	// 				element.style.display = "none";
	// 				var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
	// 				element1.style.background = "transparent";
	// 	            setTimeout(()=>{
	// 					cordova.plugins.iosrtc.refreshVideos();
	// 				}, 500);
	// 	      	}
	// 			this.callStage = 2;
	// 			this.ongoingCall = "";
	// 			this.incomingCallData = call;
	// 			this.incomingCallData.on('close', () => {
	// 				this.disconnectCall();
	// 			});

	// 		})
	// 		.catch(error => {
				
	// 		});
	// 	}else{
	// 		setTimeout(() => {
	// 			this.getIncomVideoFeed(call);
	// 		}, 2000);
	// 	}
	// }

	// setActiveScreen(n){
	// 	this.activeScreen = n;
	// 	if (this.platform.is('ios')) {
	// 		setTimeout(()=>{
	// 			cordova.plugins.iosrtc.refreshVideos();
	// 		}, 500);
 //      	}
	// }

	// answerCall(){
		
	// 		this.incomingCallData.answer(this.myStream);
	// 		let id=0;
	// 		this.incomingCallData.on('error', (error) => {

	// 		});
	// 		var receive_flag = 0;
	// 		this.nativeAudio.stop('ringtone')
	// 		.then(onSuccess => {}, onError => {});
	// 		this.incomingCallData.on('stream', (stream) => {

	// 			if (id != stream.id) {
	// 				console.log('audio', stream.getAudioTracks()[0]);
	// 				if(receive_flag == 0){
	// 					this.setCallLog(this.myUserId, 'received', new Date());
	// 					receive_flag = 1;
	// 				}
					
					
	// 				this.callStage = 3;
	// 				this.activeScreen = 1;
	// 				this.callStartTime = new Date();
	// 				if(this.timeIntStarted == 0){
	// 					this.timeIntStarted = 1;
	// 					this.timeInt = setInterval(()=>{
	// 						this.getRemainingTime();
	// 					}, 1000);
	// 				}

	// 				id = stream.id;
	// 				this.remoteStream = stream;
	// 				this.callerScreen.srcObject = this.remoteStream;
	// 				if (this.platform.is('ios')) {
	// 					setTimeout(()=>{
	// 						cordova.plugins.iosrtc.refreshVideos();
	// 					}, 500);
	// 		      	}
					
	// 			}
	// 		});
		
	// }



	// receiverEnabled(){
	// 	if(this.callStage == 0 ||this.callStage == 3 || this.callStage == 4){
	// 		return;
	// 	}
		
	// }

	// switchAudio(){
	// 	if(this.soundMode == 0){
	// 		this.platform.ready().then(() => {
	// 			AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 		});
	// 		// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 		this.soundMode = 1;
	// 	}
	// 	else{
	// 		this.platform.ready().then(() => {
	// 			AudioToggle.setAudioMode(AudioToggle.EARPIECE);
	// 		});
	// 		// AudioToggle.setAudioMode(AudioToggle.EARPIECE);
	// 		this.soundMode = 0;
	// 	}
	// }

	// muteUnmuteAudio(){
	
	// 	this.audio_muted = (this.audio_muted == 0)?1:0;

	// 	if(this.myStream != null && this.myStream.getAudioTracks().length > 0){
	    	
	//     	if(this.audio_muted == 0){
	//     		this.myStream.getAudioTracks()[0].enabled = true;
	//     	}
	//     	else{
	//     		this.myStream.getAudioTracks()[0].enabled = false;
	//     	}
	//   	}

	//   	var call_message = {
	// 		'type': 'audio_muted',
	// 		'value': this.audio_muted
	// 	};
	// 	this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));

	//   	if (this.platform.is('ios')) {
 //            setTimeout(()=>{
	// 			cordova.plugins.iosrtc.refreshVideos();
	// 		}, 500);
 //      	}
	
	
	// }

	// muteUnmuteVideo(){

	// 	this.video_muted = (this.video_muted == 0)?1:0;
	// 	// this.call.muteVideo(this.video_muted);
	// 	if(this.myStream != null && this.myStream.getVideoTracks().length > 0){
	    	
	//     	if(this.video_muted == 0){
	//     		this.myStream.getVideoTracks()[0].enabled = true;
	//     	}
	//     	else{
	//     		this.myStream.getVideoTracks()[0].enabled = false;
	//     	}
	//   	}

	//   	var call_message = {
	// 		'type': 'video_muted',
	// 		'value': this.video_muted
	// 	};
	// 	this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));

	//   	if (this.platform.is('ios')) {
 //            setTimeout(()=>{
	// 			cordova.plugins.iosrtc.refreshVideos();
	// 		}, 500);
 //      	}
	
	// }


	// disconnectMyCall(){
	// 	var call_message = {
	// 		'type': 'disconnect'
	// 	};
	// 	this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));
	
	// 	clearInterval(this.timeInt);
	// 	if (this.platform.is('cordova')) {
	// 		this.insomnia.allowSleepAgain()
	// 	  	.then(
	// 		    () => console.log('success'),
	// 		    () => console.log('error')
	// 	  	);
	//   	}
	// 	if(this.callStage == 2){
	// 		this.setCallLog(this.myUserId, 'declined', new Date());
	// 	}
	// 	if(this.callStage == 1){
	// 		this.setCallLog(this.myUserId, 'declined_before_connect', new Date());
	// 	}
	// 	if(this.callStage == 4){
	// 		this.setCallLog(this.myUserId, 'declined_after_connect', new Date());
	// 	}
	// 	if(this.callStage == 3){
	// 		this.setCallLog(this.myUserId, 'disconnected', new Date());
	// 	}

	// 	if(this.myStream){
	// 		this.myStream.getTracks().forEach(track => track.stop())
	// 	}
		
	// 	if(this.remoteStream && this.remoteStream.getTracks()){
	// 		this.remoteStream.getTracks().forEach(track => track.stop())
	// 	}
	// 	if(this.callStage == 3){
	// 		this.callStage = 0;
	// 		this._ngZone.run(() => {
	// 			this.router.navigate(['/summary/'+this.order.id]);
	// 		});
	// 	}else{
	// 		this.callStage = 0;
	// 	}
	// 	this.resetAllCallData();

	// }

	// disconnectCall(){
	// 	if(!(this.timeInt == undefined)){
	// 		clearInterval(this.timeInt);
	// 	}
	// 	if (this.platform.is('cordova')) {
	// 		this.insomnia.allowSleepAgain()
	// 	  	.then(
	// 		    () => console.log('success'),
	// 		    () => console.log('error')
	// 	  	);
	//   	}

	// 	if(this.myStream){
	// 		this.myStream.getTracks().forEach(track => track.stop())
	// 	}
		
	// 	if(this.remoteStream && this.remoteStream.getTracks()){
	// 		this.remoteStream.getTracks().forEach(track => track.stop())
	// 	}
	// 	if(this.callStage == 3){
	// 		this.callStage = 0;
	// 		this._ngZone.run(() => {
	// 			this.router.navigate(['/summary/'+this.order.id]);
	// 		});
	// 	}else{
	// 		this.callStage = 0;
	// 	}
	// 	this.resetAllCallData();
	// }

	// resetAllCallData(){
	// 	// ================================================
	// 	// Reset Everything
	// 	// ================================================
	// 	// setTimeout(() => {
	// 		// this.connId = null;
	// 		// this.conn = null;
	// 	// }, 1000);

	// 	this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.defVolume)
	//    	.then(() => {
	    	
	//    	})
	//    	.catch((reason) => {
     		
	//    	});

	// 	this.nativeAudio.stop('ringtone')
	// 	.then(onSuccess => {}, onError => {});
	// 	this.nativeAudio.stop('ringing')
	// 	.then(onSuccess => {}, onError => {});
	// 	this.platform.ready().then(() => {
	// 		AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 	});
	// 	// AudioToggle.setAudioMode(AudioToggle.SPEAKER);
	// 	this.soundMode = 0;
	// 	this.timeIntStarted = 0;
	// 	this.callExtendRequest = 0;
	// 	this.callExtendRequested = 0;
	// 	this.callExtendShown = 0;
	// 	this.callExtended = 0;
	// 	this.showCancel = 0;
	// 	this.chatWin = 0;
	// 	this.activeScreen = 2;
	// 	this.newChat = 0;
	// 	this.audio_muted = 0;
	// 	this.video_muted = 0;
	// 	this.remote_audio_muted = 0;
	// 	this.remote_video_muted = 0;
	// 	this.callToEnd = null;
	// 	var element:any = document.getElementsByClassName('ion-page')[0];
	// 	element.style.display = "flex";
	// 	var element1:any = document.getElementsByClassName('call-screen-wrap')[0];
	// 	document.querySelector('#remText').innerHTML = "";
	// 	document.querySelector('#remMin').innerHTML = "";
	// 	document.querySelector('#remSec').innerHTML = "";
	// 	document.querySelector('#remText1').innerHTML = "";
	// 	document.querySelector('#remMin1').innerHTML = "";
	// 	document.querySelector('#remSec1').innerHTML = "";
	// 	document.querySelector('#remText2').innerHTML = "";
	// 	document.querySelector('#remMin2').innerHTML = "";
	// 	document.querySelector('#remSec2').innerHTML = "";

	// 	// setTimeout(() => {

	// 		// if(!(this.incomingCallData == undefined)){
	// 		// 	for (let conns in this.peer.connections) {
	// 		// 	    this.peer.connections[conns].forEach((conn, index, array) => {
	// 		// 	    	if(!(conn.peerConnection == undefined)){
	// 		// 		      	conn.peerConnection.close();
	// 		// 	        }
	// 		//     	});
	// 		//   	}
	// 		// }

	// 		// if(!(this.outgoingCallData == undefined)){
	// 		// 	for (let conns in this.peer.connections) {
	// 		// 	    this.peer.connections[conns].forEach((conn, index, array) => {
	// 		// 	    	if(!(conn.peerConnection == undefined)){
	// 		// 		      	conn.peerConnection.close();
	// 		// 	      	}
	// 		//     	});
	// 		//   	}
	// 		// }

	// 	// }, 5000);

	// 	// this.other_user = "";
	// }

	// extend(val){
	// 	this.callExtendRequest = 0;
	// 	this.callExtendShown = 1;
	// 	if(val == 0){
	// 		this.callExtended = 0;
	// 	}
	// 	else{

	// 		var call_message = {
	// 			'type': 'extension_requested'
	// 		};
	// 		this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));
			
	// 	}
	// }


	// extendAllow(val){
	// 	this.callExtendRequested = 0;
	// 	if(val == 0){
	// 		this.callExtended = 0;

	// 		var call_message = {
	// 			'type': 'extension_denied'
	// 		};
	// 		this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));
	// 	}
	// 	else{
	// 		this.callExtended = 1;

	// 		var call_message = {
	// 			'type': 'extension_allowed'
	// 		};
	// 		this.sendCallMsgs(this.other_user.calling_id, JSON.stringify(call_message));
	// 	}
	// }

	// getChatData(){
	// 	this.userDets = this.misc.getUserDets();
	// 	this.chatMsgs = [];
	// 	this.itemRef = this.db.object('chat'+this.order.id);
	// 	this.itemRef.snapshotChanges().subscribe(action => {
	// 		if(!(action.payload.val() == null)){
	// 			this.chatMsgs = action.payload.val();
	// 			if(!(this.chatMsgs == "")){
	// 				this.chatMsgs = JSON.parse(this.chatMsgs);
	// 			}
	// 			else{
	// 				this.chatMsgs = [];
	// 			}
	// 			if(this.chatWin == 0){
	// 				this.newChat = 1;
	// 			}
	// 		}
	// 	});
	// }

	// sendFireMsg(msg){
	// 	var data = {
	// 		'user_id' : this.other_user.id,
	// 		'msg': msg,
	// 		'order_id': this.order.id
	// 	};
	// 	this.api.sendFireMsg(data)
	// 	.then(resp => {
	// 		// // console.log(resp);
	// 	})
	// 	.catch(err => {
	// 		// // console.log(err);
	// 	})

	// }

	// receiveFireMsg(msg){
		
	// }

	// sendMsg(){
	// 	if(this.message == ""){
	// 		this.misc.showToast('Please enter a message.');
	// 		return;
	// 	}

	// 	var data = {
	// 		"message": this.message,
	// 		"from": this.myUserId
	// 	};

	// 	this.chatMsgs.push(data);

	// 	var apidata = JSON.stringify(this.chatMsgs);
	// 	const sendRef = this.db.object('chat'+this.order.id);
	// 	sendRef.set(apidata);
	// 	this.message = "";
	// }

	// setCallLog(user_id, action, time){

	// 	if(!(action == "init_call")){
	// 		setTimeout( ()=> {
	// 			var data = {
	// 				'user_id': user_id,
	// 				'action': action,
	// 				'time': time,
	// 				'order_id': this.order.id
	// 			};
	// 			this.api.sendCallLog(data)
	// 			.then(resp => {

	// 			})
	// 			.catch(err => {

	// 			});
	// 		}, 100);
	// 	}
	// 	else{
	// 		var data = {
	// 			'user_id': user_id,
	// 			'action': action,
	// 			'time': time,
	// 			'order_id': this.order.id
	// 		};
	// 		this.api.sendCallLog(data)
	// 		.then(resp => {
	// 			// console.log(resp);
	// 		})
	// 		.catch(err => {

	// 		});
	// 	}
	// }


	showAcceptToast(order){
		var data = order;
		data['date'] = (new Date((data['date']+" UTC").replace(/-/g, '/'))).toISOString();
		this.bookingRequest = data;
	}

	// cancelOrder(order_id){
	// 	var data = {
	// 		cancel_type: 2,
	// 		order_id: this.order.id
	// 	};
	// 	this.api.cancelOrder(data)
	// 	.then(resp => {
	// 		this.misc.showToast('Order Cancelled succesfully');
	// 		this.disconnectMyCall();
	// 	})
	// 	.catch(err => {
	// 		// // console.log(err);
	// 		this.misc.handleError(err);
	// 	});
	// }

	// acceptOrder(order_id, status){
	// 	var data = {
	// 		'order_id': order_id,
	// 		'status' : status
	// 	};
	// 	this.misc.showLoader();
	// 	this.api.acceptOrder(data)
	// 	.then(resp => {
	// 		var order_date = new Date((resp.data.order.date + " UTC").replace(/-/g, "/"));
 //          	if(status == 1){
	// 			var trigger_time = new Date(new Date(order_date).getTime() - 300000);  
	// 			// console.log(trigger_time);
	// 			this.localNotifications.schedule({
	// 			   	title: "Upcoming order.",
	// 			   	text: 'Thank you for using Samanta. Your client booking begins in five minutes. Please be online and prepared for the appointment.',
	// 			   	trigger: {at: trigger_time},
	// 			   	led: 'FF0000',
	// 			   	sound: null
	// 			});
	// 		}

	// 		this.bookingRequest = "";

	// 		this.misc.hideLoader();
	// 		var message = {
	// 			'type': 'order_accepted',
	// 			'order': resp.data.order
	// 		};
	// 		this.sendCallMsgs(resp.data.order.target_user, JSON.stringify(message));
	// 		this._ngZone.run(() => {
	// 			this.firebase.UserAcceptFn();
 //  			});
	// 	})
	// 	.catch(err => {

	// 	});
	// }
	// getRemainingTime(){
	// 		var endTime = new Date((this.order.to_time+" UTC").replace(/-/g, '/'));
	// 		var total = endTime.getTime() - new Date().getTime();
			
	// 		var timeNow = new Date().getTime() - this.callStartTime.getTime();
	// 		var time_passed = timeNow/1000;
	// 		if(time_passed > 60){
	// 			this.showCancel = 0;
	// 		}
	// 		else{
	// 			this.showCancel = 1;
	// 		}

	// 		if(total < 0 && this.callExtended == 0){
	// 			clearInterval(this.timeInt);
	// 			if(!(this.userDets.user_type == 3)){
	// 				this.disconnectMyCall();
	// 			}
	// 		}
	// 		else{
	// 			if(!(this.callToEnd == null)){
	// 				if(((new Date()).toISOString()) >= this.callToEnd){
	// 					clearInterval(this.timeInt);
	// 					if(!(this.userDets.user_type == 3)){
	// 						this.disconnectMyCall();
	// 					}
	// 				}
	// 			}
	// 			if(total < 0){
	// 				var rem_text = "Extra Time";
	// 				total = (new Date().getTime()) - (endTime.getTime());
	// 			}
	// 			else{
	// 				var rem_text = "Remaining time";
	// 			}
	// 			var seconds:any = Math.floor( (total/1000) % 60 );
	// 			var minutes:any = Math.floor( (total/1000/60) % 60 );
	// 			var totalMinutes:any = Math.floor((total/1000/60));
				
	// 			if(minutes < 2 && this.order.user_id == this.myUserId && this.callExtendShown == 0){
	// 				this.callExtendRequest = 1;
				
	// 			}
	// 			if(minutes < 0){
				
	// 				minutes = -(minutes);
				
	// 			}
	// 			if(seconds < 0){
				
	// 				seconds = -(seconds);
				
	// 			}

	// 			if(minutes < 10){
	// 				minutes = "0"+minutes;
	// 			}

	// 			if(seconds < 10){
	// 				seconds = "0"+seconds;
	// 			}

	// 			this.rem_text = rem_text;
	// 			this.minutes = minutes;
	// 			this.seconds = seconds;
				
	// 			document.querySelector('#remText').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec').innerHTML = ""+seconds;
	// 			document.querySelector('#remText1').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin1').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec1').innerHTML = ""+seconds;
	// 			document.querySelector('#remText2').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin2').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec2').innerHTML = ""+seconds;

	// 		}
	// }

}