import { Component, AfterViewInit } from '@angular/core';
import { MiscService } from './services/misc.service';
import { ApiService } from './services/api.service';
// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Platform, NavController } from '@ionic/angular';
import { Router, GuardsCheckStart, GuardsCheckEnd, ActivatedRoute } from '@angular/router';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ProviderdetsPage } from './providerdets/providerdets.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { CallKitService } from './services/callkit.service';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import OneSignal from 'onesignal-cordova-plugin';
declare let window: any;
declare let cordova:any;
// declare let ConnectyCube:any;
// import 'webrtc-adapter';
@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
	splash:any = 0;
	loadCallS:any = 1;
	loading:any = false;
	platform_name:any = "web";
	app_ver:any = 106;
	keepSplash:any = 1;
	showPerm:any = 0;
	constructor(
	// private firebasex: FirebaseX,
	private api:ApiService,
	private backgroundMode: BackgroundMode,
	public platform: Platform,
	private misc: MiscService,
	// private callkit:CallKitService,
	private navController: NavController,
	private deeplinks: Deeplinks,
	private router:Router,
	// private splashScreen: SplashScreen,
	private nativeAudio: NativeAudio) {
		// this.misc.getAllPermissions();
		this.platform.ready().then(async () => {
			if(this.platform.is('cordova')){

				this.misc.onesignal = OneSignal;
				this.misc.onesignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
				await this.misc.onesignal.promptForPushNotificationsWithUserResponse((accepted) => {
					console.log("User accepted notifications: " + accepted);
				});
			}
			
			this.createCallChannel();
			if(this.platform.is('ios')){
				await cordova.plugins.diagnostic.getPermissionAuthorizationStatus((status) => {
				switch(status){
					case cordova.plugins.diagnostic.permissionStatus.GRANTED:
						console.log("Permission granted to use the camera");
					break;
					case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
						console.log("Permission to use the camera has not been requested yet");
					break;
					case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
						console.log("Permission denied to use the camera - ask again?");
					break;
					case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
						console.log("Permission permanently denied to use the camera - guess we won't be using it then!");
					break;
				}
				}, (error) => {
					console.error("The following error occurred: "+error);
				},cordova.plugins.diagnostic.permission.CAMERA);

				await cordova.plugins.diagnostic.getPermissionAuthorizationStatus((status) => {
				switch(status){
					case cordova.plugins.diagnostic.permissionStatus.GRANTED:
						console.log("Permission granted to use the Microphone");
					break;
					case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
						console.log("Permission to use the Microphone has not been requested yet");
					break;
					case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
						console.log("Permission denied to use the Microphone - ask again?");
					break;
					case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
						console.log("Permission permanently denied to use the Microphone - guess we won't be using it then!");
					break;
				}
				}, (error) => {
					console.error("The following error occurred: "+error);
				},cordova.plugins.diagnostic.permission.RECORD_AUDIO);
			}
			else{
				await cordova.plugins.diagnostic.requestRuntimePermission((status) =>{
					switch(status){
					case cordova.plugins.diagnostic.permissionStatus.GRANTED:
						
						console.log("Permission granted to make phone calls");
						break;
						case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
							console.log("Permission to use the camera has not been requested yet");
							break;
						case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCe:
							console.log("Permission denied to use the camera - ask again?");
							break;

						case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
							console.log("Permission permanently denied to use the camera - guess we won't be using it then!");
							break;
					}
				}, (error) => {
					console.error("The following error occurred: "+error);
				}, cordova.plugins.diagnostic.permission.READ_PHONE_NUMBERS);
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

	ngAfterViewInit(){
		
		// this.getPermissions();
		var permReq = window.localStorage.getItem('permReq');
		if(permReq == undefined || permReq == null){
			// this.showPerm = 1;
			this.getPermissions();
		}
		else{
			// this.showPerm = 0;
		}

		this.api.getAppVer()
		.then(resp => {
			if(resp > this.app_ver){
				// updApp
				document.getElementById('updApp').style.display = "block";
			}
		})
		.catch(err => {
			console.log(err);
		})

		

		this.router.events.subscribe(event => {
			// if (event instanceof GuardsCheckStart) {
			// 	this.loading = true;
			// 	// console.log("GuardStart")
			// }     
			// if (event instanceof GuardsCheckEnd) {
			// 	setTimeout(()=>{
			// 		this.loading = false;
			// 	}, 500);
			// 	// console.log("GuardEnd")
			// } 
		});

		this.platform.ready().then(() => {
			
			this.listenToMessage();
			
			// this.nativeAudio.preloadComplex('ringtone', 'assets/sounds/ring.mp3', 1, 1, 1).then(resp => {
			// } , err => {console.log(err);});

			// this.nativeAudio.preloadComplex('ringing', 'assets/sounds/ringing.mp3', 1, 1, 1).then(resp => { console.log('dsfds', resp)
			// } , err => {console.log(err);});

			// document.addEventListener('audioroute-changed',
			// 	function(event:any) {
			// 		console.log('Audio route changed: ' + event);
			// 		// code for stuff you want to do
			// 	}
			// );
			// setTimeout(()=>{
			// 	this.splash = 1;
			// }, 4000);

			this.deeplinks.routeWithNavController(this.navController, {
				'/:id':'/providerdets'
			}).subscribe((match) => {
				var url_parts = match.$link;
				if(url_parts.scheme == 'https'){
					var lastslashindex = (url_parts.path).lastIndexOf('/');
					var result= (url_parts.path).substring(lastslashindex  + 1);
					this.router.navigate(['/providerdets/'+result]);
				}
				else{
					this.router.navigate(['/'+url_parts.host+url_parts.path]);
				}
			},
			(nomatch) => {
				// nomatch.$link - the full link data
				console.error('Got a deeplink that didn\'t match', nomatch);
			});

			this.deeplinks.routeWithNavController(this.navController, {
				'':'/wallet'
			}).subscribe((match) => {
				// match.$route - the route we matched, which is the matched entry from the arguments to route()
				// match.$args - the args passed in the link
				// match.$link - the full link data
				// console.log('Successfully matched route', match.$link);
				var url_parts = match.$link;
				if(url_parts.scheme == 'https'){
					var lastslashindex = (url_parts.path).lastIndexOf('/');
					var result= (url_parts.path).substring(lastslashindex  + 1);
					this.router.navigate(['/providerdets/'+result]);
				}
				else{
					this.router.navigate(['/'+url_parts.host+url_parts.path]);
				}

			},
			(nomatch) => {
				// nomatch.$link - the full link data
				console.error('Got a deeplink that didn\'t match', nomatch);
			});


		});
	}

	getPermissions(){
		this.misc.getAllPermissions();
		// window.localStorage.setItem('permReq', 1);
		
		this.showPerm = 0;
	}

	callChanged(e){
		console.log('callchanged', e);
	}
	audioSystem(e){
		console.log('audiosystem', e);
	}


	listenToMessage(){
		
  	}

	openStore(){
		var url = "";
		if(this.platform.is('ios')){
			url = 'https://apps.apple.com/us/app/samanta/id1597895494';
		}
		else if(this.platform.is('android')){
			url = 'https://play.google.com/store/apps/details?id=com.samantapp.app';
		}
		else{
			url = 'http://google.com';
		}
		window.open(url,'_system', 'location=yes');
	}

	hideNoteMsg(){
		document.getElementById('notePerm').style.display = "none";
	}

	createCallChannel(){
		var channel:any  = {
		    // channel ID - must be unique per app package
		    id: "call_channel_local",

		    // Channel description. Default: empty string
		    description: "Used for displaying call based notifications.",

		    // Channel name. Default: empty string
		    name: "Calls",

		    //The sound to play once a push comes. Default value: 'default'
		    //Values allowed:
		    //'default' - plays the default notification sound
		    //'ringtone' - plays the currently set ringtone
		    //'false' - silent; don't play any sound
		    //filename - the filename of the sound file located in '/res/raw' without file extension (mysound.mp3 -> mysound)
		    sound: 'false',

		    //Vibrate on new notification. Default value: true
		    //Possible values:
		    //Boolean - vibrate or not
		    //Array - vibration pattern - e.g. [500, 200, 500] - milliseconds vibrate, milliseconds pause, vibrate, pause, etc.
		    vibration: false,

		    // Whether to blink the LED
		    light: true,

		    //LED color in ARGB format - this example BLUE color. If set to -1, light color will be default. Default value: -1.
		    lightColor: parseInt("FF0000FF", 16).toString(),

		    //Importance - integer from 0 to 4. Default value: 4
		    //0 - none - no sound, does not show in the shade
		    //1 - min - no sound, only shows in the shade, below the fold
		    //2 - low - no sound, shows in the shade, and potentially in the status bar
		    //3 - default - shows everywhere, makes noise, but does not visually intrude
		    //4 - high - shows everywhere, makes noise and peeks
		    importance: 4,

		    //Show badge over app icon when non handled pushes are present. Default value: true
		    badge: false,

		    //Show message on locked screen. Default value: 1
		    //Possible values (default 1):
		    //-1 - secret - Do not reveal any part of the notification on a secure lockscreen.
		    //0 - private - Show the notification on all lockscreens, but conceal sensitive or private information on secure lockscreens.
		    //1 - public - Show the notification in its entirety on all lockscreens.
		    visibility: 1,

		    // Optionally specify the usage type of the notification. Defaults to USAGE_NOTIFICATION_RINGTONE ( =6)
		    // For a list of all possible usages, see https://developer.android.com/reference/android/media/AudioAttributes.Builder#setUsage(int)

		    // usage: 6,
		    // Optionally specify the stream type of the notification channel.
		    // For a list of all possible values, see https://developer.android.com/reference/android/media/AudioAttributes.Builder#setLegacyStreamType(int)
		    // streamType: 5,
		};

		// Create the channel
		// this.firebasex.createChannel(channel)
		// .then(channel_c => {

		//     console.log('Channel_c created: ' + channel_c);
		// }).
		// catch(error =>{
		//    console.log('Create channel error: ' + error);
		// });

		var channel1:any  = {
		    // channel ID - must be unique per app package
		    id: "call_channel_ongoing",
		    description: "Used for displaying ongoing calls.",
		    name: "Ongoing Calls",
		    sound: 'false',
		    vibration: false,
		    light: false,
		    lightColor: parseInt("FF0000FF", 16).toString(),
		    importance: 4,
		    badge: false,
		    visibility: 1,
		};

		// Create the channel
		// this.firebasex.createChannel(channel1)
		// .then(channel_c => {

		//     console.log('Channel_c1 created: ' + channel_c);
		// }).
		// catch(error =>{
		//    console.log('Create channel error: ' + error);
		// });

	}
}