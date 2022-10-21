declare var Peer:any;
import { Injectable } from '@angular/core';
// import Peer from 'peerjs';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
// import { Autostart } from '@ionic-native/autostart/ngx';
import { Subject, Observable } from 'rxjs';
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ApiService } from './api.service';
import { MiscService } from './misc.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
// import { NativeRingtones } from '@ionic-native/native-ringtones/ngx';
// import { NativeAudio } from '@ionic-native/native-audio/ngx';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// declare var AudioToggle:any;
export interface Comm {
	 status:any;
	 chatMsgs:any;
}

@Injectable({
	providedIn: 'root'
})
export class CallService {
	private chatDataFn:(order_id, user_id) => void;
	private callFn:(order_id) => void;
	private destroyPeer:() => void;
	peer:typeof Peer;
	peerInit:any = 0;
	userId:any;
	targetId:any;
	orderId:any = 0;
	callExtendedShown:any = 0;
	callExtended:any = 0;
	callMainUpd:any = 0;
	// private orderId: Subject<number> = new Subject<number>();
	options:any;
	myScreen:any;
	order:any;
	callerScreen:any;
	incomingCall:any;
	callStartTime:any;
	endTime:any;
	myStream: MediaStream;
	outgoingCall:any;
	remoteStream: MediaStream;
	itemRef: AngularFireObject<any>;
	comm:Comm = { status : "waiting", chatMsgs: "" };
	// callData:any;
	// callData:any;
	inCall:any = 0;
	outCall:any=0;
	timeInt:any;
	callExtMin:any = 0;
	minUpdated:any = -1;
	retried:any = 0;
	callData:any;
	inData:any;
	outData:any;
	// public userDetailsObs = this.orderId.asObservable();
	constructor(
		private db: AngularFireDatabase,
		private api: ApiService,
		private misc: MiscService,
		// public foregroundService: ForegroundService,
		// private autostart: Autostart,
    	private backgroundMode: BackgroundMode,
    	private router:Router,
    	private route: ActivatedRoute
	) {
		this.comm.chatMsgs = "";
		// this.orderId = 0;
		this.options = {  // not used, by default it'll use peerjs server
			// host: '54.73.63.45',
			// port: 9000,
			// path: '/samanta',
			// secure: false,
			debug: 0,
			config: { 'iceServers': [
				{ 'urls': 'stun:stun.l.google.com:19302' },
				{
					urls: 'turn:numb.viagenie.ca',
					credential: 'muazkh',
					username: 'webrtc@live.com'
				},
			]}
		};
	}


	async init(userId:any) {

		// clearInterval(this.timeInt);
		// // this.autostart.enable();

		// this.callExtMin = 0;
		// this.comm.chatMsgs = "";
		// this.callStartTime = "";
		// this.endTime = "";
		// this.callMainUpd = 0;
		// this.callExtended = 0;
		// // this.foregroundService.start('Running in Background', 'Background Service', 'drawable/icon');
		// this.userId = userId;
		// this.myScreen = document.getElementById('myVideo');
		// this.myScreen.muted = "true";
		// this.callerScreen = document.getElementById('callerVideo');
		// await this.createPeer('SamantaPJS'+userId);
	}

	async createPeer(userId:any) {
		// // console.log('init user '+userId);
		// // console.log(this.peer);
		// if(this.peerInit == 0){
		// 	this.peerInit = 1;
		// 	this.peer = new Peer(userId, this.options);
		// 	this.peer.on('open', () => {
		// 		this.wait();
		// 	});
		// }
	}

	initChatData(fn: () => void){
  		this.chatDataFn = fn;
  	}


	initDestroy(fn: () => void){
  		this.destroyPeer = fn;
  	}

  	destroyPeerFn(){
  		this.destroyPeer();
  	}

  	initCall(fn: () => void){
  		this.callFn = fn;
  	}

	// wait() {
	// 	// console.log('waiting for incoming');
	// 	this.peer.on('connection', (data) => {
	// 		this.inData = data;
	// 		this.waitForInData();
	// 	});

	// 	this.peer.on('call', (call) => {
			
	// 		this.inCall = 1;
			
	// 		this.incomingCall = call;
			
	// 		this.comm.status = 'incoming';
			
	// 		document.getElementById("callScreen").style.display = "block";
			
	// 		this.backgroundMode.moveToForeground();

	// 	});

	// }


	// waitForData(){
	// 	this.outData.on('data', (data)=>{
	// 		// // console.log(data.type);
	// 		var type = data.type;
	// 		if(type == 'close'){
	// 			this.disconnected();
	// 		}
	// 		if(type == 'extend'){
	// 			document.getElementById("extendPopAllow").style.display = "block";
	// 			document.getElementById("remTimeWrap").style.display = "none";
	// 		}
	// 		if(type == 'extendAllow'){
	// 			if(data.value == 0){
	// 				this.callExtended = 0;
	// 				this.misc.showToast('Service provider Rejected Extend request');
	// 			}
	// 			else{
	// 				this.callExtended = 1;
	// 				this.misc.showToast('Service provider accepted Extend request');
	// 			}
	// 		}


	// 		// console.log(data.type);
	// 		var type = data.type;
	// 		if(type == 'close'){
	// 			this.disconnected();
	// 		}
	// 		if(type == 'order'){
	// 			this.orderId = data.order_id;
	// 			this.chatDataFn(data.order_id, this.userId);
	// 			// this.getOrderDets();
	// 			// console.log(this.orderId);
	// 			this.getOrderDets();
	// 		}
	// 		if(type == 'extend'){
	// 			document.getElementById("extendPopAllow").style.display = "block";
	// 			document.getElementById("remTimeWrap").style.display = "none";
	// 		}
	// 		if(type == 'extendAllow'){
	// 			if(data.value == 0){
	// 				this.callExtended = 0;
	// 				this.misc.showToast('Service provider Rejected Extend request');
	// 			}
	// 			else{
	// 				this.callExtended = 1;
	// 				this.misc.showToast('Service provider accepted Extend request');
	// 			}
	// 		}


	// 	});
	// }
	// waitForInData(){
	// 	// console.log('waiting for data');
	// 	this.inData.on('data', (data)=>{
	// 		// console.log(data.type);
	// 		var type = data.type;
	// 		if(type == 'close'){
	// 			this.disconnected();
	// 		}
	// 		if(type == 'order'){
	// 			this.orderId = data.order_id;
	// 			this.chatDataFn(data.order_id, this.userId);
	// 			// this.getOrderDets();
	// 			// console.log(this.orderId);
	// 			this.getOrderDets();
	// 		}
	// 		if(type == 'extend'){
	// 			document.getElementById("extendPopAllow").style.display = "block";
	// 			document.getElementById("remTimeWrap").style.display = "none";
	// 		}
	// 		if(type == 'extendAllow'){
	// 			if(data.value == 0){
	// 				this.callExtended = 0;
	// 				this.misc.showToast('Service provider Rejected Extend request');
	// 			}
	// 			else{
	// 				this.callExtended = 1;
	// 				this.misc.showToast('Service provider accepted Extend request');
	// 			}
	// 		}
	// 	});
	// }
	// call(partnerId, orderId){
	// 	this.callFn(orderId);
	// }
	call(partner_id, order_id){
		this.callFn(order_id);
	}
	// call(partnerId: string, orderId) {
	// 	var data = {
	// 		'user_id':partnerId,
	// 		'order_id':orderId
	// 	};
	// 	this.api.startCall(data)
	// 	.then(response => {
	// 		this.orderId = orderId;
	// 		this.chatDataFn(orderId, this.userId);
	// 		this.outData = this.peer.connect('SamantaPJS'+partnerId, {reliable: true});
	// 		this.waitForData();
	// 		// this.comm.orderId = orderId;
	// 		// // console.log('orrrrrr'+this.comm.orderId );
	// 		this.targetId = partnerId;
	// 		// console.log(partnerId);
	// 		this.comm.status = "outgoing";
	// 		navigator.getUserMedia({ audio: true, video: true }, (stream) => {
	// 			this.myStream = stream;
	// 			// console.log(this.myStream);
	// 			this.myScreen.srcObject = this.myStream;
	// 			document.getElementById("callScreen").style.display = "block";
	// 			// setTimeout(() => {
	// 				this.outgoingCall = this.peer.call('SamantaPJS'+partnerId, this.myStream);
	// 				this.peer.on("error", (err) => {
	// 					// console.log(err.type);
	// 					if(err.type == 'peer-unavailable'){
	// 						setTimeout(() => {
	// 							this.retried++;
	// 							if(this.retried == 0){
	// 				    			this.call(partnerId, orderId);
	// 				    			this.retried = 1;
	// 			    			}
	// 			    		}, 10000);
	// 			    	}
	// 				});
	// 				this.outCall = 1;
	// 				this.outgoingCall.on('stream', (instream) => {
	// 					this.callStartTime = new Date();
	// 					this.comm.status = "oncall";
	// 					// console.log('got caller remote stream');
	// 					var data = {
	// 						'type': 'order',
	// 						'order_id': this.orderId
	// 					};
	// 					this.outData.send(data);
	// 					this.getOrderDets();
	// 					this.remoteStream = instream;
	// 					this.callerScreen.srcObject = this.remoteStream;
	// 				});
	// 				// this.outgoingCall.on('close', () => {
	// 				// 	alert('call disconnected');
	// 				// 	this.close(0);
	// 				// });
	// 			// }, 10000);

	// 		}, (error) => {
	// 			// console.log(error);
	// 			this.handleError(error);
	// 		});
	// 	})
	// 	.catch(err => {

	// 	});
	// }

	// answerCall(){
	// 	navigator.getUserMedia({ audio: true, video: true }, (stream) => {
	// 		this.myStream = stream;
	// 		this.myScreen.srcObject = this.myStream;
			
	// 		this.incomingCall.answer(this.myStream);
	// 		let id;
	// 		this.incomingCall.on('error', (error) => {
	// 			// console.log(error);
	// 		});

	// 		this.incomingCall.on('stream', (stream) => {
	// 			this.callStartTime = new Date();
	// 			this.comm.status = 'oncall';
	// 			// // console.log('orderid is '+this.orderId);
	// 			if (id != stream.id) {
	// 				id = stream.id;
	// 				this.remoteStream = stream;
	// 				this.callerScreen.srcObject = this.remoteStream;
	// 			}
				
	// 		});
	// 	}, (error) => {
	// 		this.handleError(error);
	// 	});
	// }

	handleError(error: any) {
		// console.log(error);
	}

	errorMsg(msg: string, error?: any) {
		const errorElement = document.querySelector('#callScreen');
		errorElement.innerHTML += `<p>${msg}</p>`;
		if (typeof error !== 'undefined') {
			console.error(error);
		}
	}

	disconnected(){

		// clearInterval(this.timeInt);
		// if(this.inCall == 1){
		// 	this.incomingCall.close();
		// }
		// if(this.outCall == 1){
		// 	this.outgoingCall.close();
		// }

		// if(this.myStream){
		// 	this.myStream.getTracks().forEach(track => track.stop())
		// }
		
		// if(this.remoteStream && this.remoteStream.getTracks()){
		// 	this.remoteStream.getTracks().forEach(track => track.stop())
		// }
		// this.inCall = 0;
		// this.outCall = 0;
		// clearInterval(this.timeInt);
		// this.comm.status = "waiting";
		// this.comm.chatMsgs = "";

		// document.getElementById("callScreen").style.display = "none";
		// if(this.comm.status == "oncall"){
		// 	this.router.navigate(['/summary/'+this.orderId]);
		// }
	}

	close(send){

		// clearInterval(this.timeInt);
		// if(send == 1 || send == 2){
		// 	var data = {
		// 		'type': 'close'
		// 	}
		// 	if(this.inCall == 1){
		// 		this.incomingCall.close();
		// 		this.inData.send(data);
		// 	}
		// 	if(this.outCall == 1){
		// 		this.outgoingCall.close();
		// 		this.outData.send(data);
		// 	}
		// 	if(this.comm.status == "oncall"){
		// 		var callTimeTotal = new Date().getTime() - this.callStartTime.getTime();
		// 		var diffSec = Math.floor(callTimeTotal / 1000); // minutes
		// 		var now = new Date();
		// 		if(this.comm.status == "oncall" && diffSec > 10 && send == 1) {
		// 			var totalMinutes = Math.floor((callTimeTotal/1000/60));
					
		// 			var data1 = {
		// 				call_status: 2,
		// 				total_time: totalMinutes
		// 			};
		// 			this.api.updateOrder(data1, this.orderId)
		// 			.then(resp => {
						
		// 				this.router.navigate(['/summary/'+this.orderId]);
		// 			})
		// 			.catch(err => {
		// 				this.misc.handleError(err);
		// 			});
		// 		}
		// 	}
		// }

		// this.comm.status = "waiting";
		// this.comm.chatMsgs = "";
		// clearInterval(this.timeInt);
		// // console.log(this.comm.status);
		// // this.peer.destroy();
		// document.getElementById("callScreen").style.display = "none";
		
		// if(this.myStream){
		// 	this.myStream.getTracks().forEach(track => track.stop())
		// }
		
		// if(this.remoteStream && this.remoteStream.getTracks()){
		// 	this.remoteStream.getTracks().forEach(track => track.stop())
		// }

		// this.inCall = 0;
		// this.outCall = 0;
		// this.api.endCall()
		// .then(resp => {
		// 	this.router.navigate(['/rate/'+this.orderId]);
		// })
		// .catch(err => {
		// 	this.misc.handleError(err);
		// })
		// this.peerInit = 0;
		// this.peer.reconnect();
		// this.init(this.userId);
		
		// this.nativeAudio.stop('231321321312');
		// this.nativeAudio.stop('231321321311');
	}



	muteAudio(audio_muted){
		
	}
	muteVideo(video_muted){
		
	}

	getOrderDets(){
	// 	var data = {
	//       	'order_id': this.orderId
	//     };
	//     // console.log('called');

	//     return this.api.getOrderDetails(data)
	//     .then(resp => {
	//     	var order = resp.data.order;
	//     	// if(order.plan_id == 1){
	//     	// 	var plan_min = 15;
	//     	// }
	//     	// else if(order.plan_id == 2){
	//     	// 	var plan_min = 30;
	//     	// }
	//     	// else if(order.plan_id == 3){
	//     	// 	var plan_min = 45;
	//     	// }
	//     	// else if(order.plan_id == 4){
	//     	// 	var plan_min = 60;
	//     	// }
	//     	// else if(order.plan_id == 5){
	//     	// 	var plan_min = 2;
	//     	// }
	//     	var plan_min = order.plan_time;
	//     	this.order = resp.data.order;
	//     	var orderTime = new Date(order.date+" UTC");
	// 		orderTime.setMinutes( orderTime.getMinutes() + parseInt(plan_min) );
	// 		// console.log(orderTime);
	// 		this.endTime = new Date(order.to_time+" UTC");
	// 		clearInterval(this.timeInt);
	// 		this.timeInt = setInterval(()=>{
	// 			this.getRemainingTime();
	// 		}, 1000);

	//     })
	//     .catch(err => {

	//     });
	}

	extendCall(){
	// 	this.callExtended = 1;
	// 	document.getElementById("extendPop").style.display = "none";
	// 	document.getElementById("remTimeWrap").style.display = "block";
	// 	if(this.inCall == 1){
	// 		var data = {
	// 			'type': 'extend',
	// 			'value': '1'
	// 		};
	// 		this.inData.send(data);
	// 	}
	// 	else{
	// 		var data = {
	// 			'type': 'extend',
	// 			'value': '1'
	// 		};
	// 		this.outData.send(data);
	// 	}
	}

	extendCallAllow(val){
	// 	this.callExtended = val;
	// 	document.getElementById("extendPopAllow").style.display = "none";
	// 	document.getElementById("remTimeWrap").style.display = "block";
	// 	if(this.inCall == 1){
	// 		var data = {
	// 			'type': 'extendAllow',
	// 			'value': val
	// 		};
	// 		this.inData.send(data);
	// 	}
	// 	else{
	// 		var data = {
	// 			'type': 'extendAllow',
	// 			'value': val
	// 		};
	// 		this.outData.send(data);
	// 	}
	}

	getRemainingTime(){
	// 	// this.timeInt = setInterval(()=>{
	// 		var total = this.endTime.getTime() - new Date().getTime();
			
	// 		var timeNow = new Date().getTime() - this.callStartTime.getTime();

	// 		if((timeNow/1000) > 60){
	// 			document.getElementById('callCancBtn').style.display = "none";
	// 		}
	// 		else{
	// 			document.getElementById('callCancBtn').style.display = "block";
	// 		}

	// 		if(total < 0 && this.callExtended == 0){
	// 			clearInterval(this.timeInt);
	// 			this.close(1);
	// 		}
	// 		else{
	// 			if(total < 0){
	// 				var rem_text = "Extra Time";
	// 				total = (new Date().getTime()) - (this.endTime.getTime());
	// 				if(this.callMainUpd == 0){

	// 					this.callMainUpd = 1;
	// 					var data1 = {
	// 						call_status: 1
	// 					};
	// 					this.api.updateOrder(data1, this.orderId)
	// 					.then(resp => {
	// 						// this.router.navigate(['/summary/'+this.orderId]);
	// 					})
	// 					.catch(err => {
	// 						this.misc.handleError(err);
	// 					});
	// 				}

	// 			}
	// 			else{
	// 				var rem_text = "Remaining time";
	// 			}
	// 			var seconds:any = Math.floor( (total/1000) % 60 );
	// 			var minutes:any = Math.floor( (total/1000/60) % 60 );
	// 			var totalMinutes:any = Math.floor((total/1000/60));
	// 			// console.log(totalMinutes);
	// 			// minUpdated = totalMinutes;
	// 			if((!(totalMinutes == this.minUpdated)) && (rem_text == "Extra Time") && this.order.user_id == this.userId ){
					
	// 				this.minUpdated = totalMinutes;
	// 				// console.log('mincurrent = '+totalMinutes+" updated_min = "+this.minUpdated+" rem text ="+rem_text);
					
	// 				this.api.extendCall(this.orderId)
	// 				.then(resp => {

	// 				})
	// 				.catch(err => {

	// 				});
				
	// 			}
				
	// 			if(minutes < 2 && this.order.user_id == this.userId && this.callExtendedShown == 0){
					
	// 				document.getElementById("extendPop").style.display = "block";
	// 				document.getElementById("remTimeWrap").style.display = "none";
				
	// 				this.callExtendedShown = 1;
				
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
				
	// 			document.querySelector('#remText').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec').innerHTML = ""+seconds;

	// 			document.querySelector('#remText1').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin1').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec1').innerHTML = ""+seconds;


	// 			document.querySelector('#remText2').innerHTML = ""+rem_text;
	// 			document.querySelector('#remMin2').innerHTML = ""+minutes;
	// 			document.querySelector('#remSec2').innerHTML = ""+seconds;
	// 			// this.comm.chatMsgs = rem_text+": "+minutes+":"+seconds;
	// 		}

	// 	// }, 1000);
	}

}