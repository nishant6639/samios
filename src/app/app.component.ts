import { Component, OnInit } from '@angular/core';
import { MiscService } from './services/misc.service';
import { ApiService } from './services/api.service';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Platform, NavController } from '@ionic/angular';
import { Router, GuardsCheckStart, GuardsCheckEnd, ActivatedRoute } from '@angular/router';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ProviderdetsPage } from './providerdets/providerdets.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
declare let window: any;
declare let cordova: any;
@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
	splash:any = 0;
	loading:any = false;
	platform_name:any = "web";
	app_ver:any = 106;
	keepSplash:any = 1;
		constructor(private firebase: FirebaseX,
			private api:ApiService,
    		private backgroundMode: BackgroundMode,
    		public platform: Platform,
    		private misc: MiscService,
    		private navController: NavController,
			private deeplinks: Deeplinks,
			private router:Router,
			private splashScreen: SplashScreen,
			private nativeAudio: NativeAudio) {
				this.misc.getAllPermissions();
		}

		ngOnInit(){


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
				setTimeout( () =>{
					this.splashScreen.hide();
				}, 300);
				if (this.platform.is('cordova') && this.platform.is('ios')) {
					cordova.plugins.iosrtc.registerGlobals();
				}
				this.nativeAudio.preloadComplex('ringtone', 'assets/sounds/ring.mp3', 1, 1, 1).then(resp => {
				} , err => {console.log(err);});

				this.nativeAudio.preloadComplex('ringing', 'assets/sounds/ringing.mp3', 1, 1, 1).then(resp => { console.log('dsfds', resp)
				} , err => {console.log(err);});

				document.addEventListener('audioroute-changed',
					function(event:any) {
						console.log('Audio route changed: ' + event);
						// code for stuff you want to do
					}
				);
				setTimeout(()=>{
					this.splash = 1;
				}, 4000);

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


		listenToMessage(){
	  		this.firebase.onMessageReceived()
	  		.subscribe(data => {
	  			var messagebody = JSON.parse(data.message);
				if(messagebody.type == 'order_requested'){
			  		
				}
				if(messagebody.type == 'incoming_call'){
					// this.splashScreen.hide();
					this.keepSplash = 0;
					// this._ngZone.run(() => {
					// 	var incomingData = {
					// 		'order' : messagebody.order_dets,
					// 		'user' : messagebody.user_dets,
					// 		'my_user_id' : messagebody.my_user_id
					// 	};
					// 	this.incomingCall(incomingData);
					// });
					this.backgroundMode.moveToForeground();
					// Turn screen on
					this.backgroundMode.wakeUp();
					// Turn screen on and show app even locked
					this.backgroundMode.unlock();
				}
				if(messagebody.type == 'receiver_enabled'){

				}
				if(messagebody.type == 'order_updated'){

				}

				if(messagebody.type == 'order_accepted'){
			  		
				}

				if(messagebody.type == 'in_call_messages'){
			  		
				}
	  		});
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
}