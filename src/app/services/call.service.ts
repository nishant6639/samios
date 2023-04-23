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
	private callFn:(order, order_id) => void;
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
	connectycube:any;
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

	}

	async createPeer(userId:any) {

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


	
	call(order, order_id){
		this.callFn(order, order_id);
	}
	

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
	disconnected(){ }
	close(send){ }
	muteAudio(audio_muted){ }
	muteVideo(video_muted){ }
	getOrderDets(){ }
	extendCall(){ }
	extendCallAllow(val){ }
	getRemainingTime(){ }

}