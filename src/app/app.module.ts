import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { FormsModule } from '@angular/forms';
import { Toast } from '@ionic-native/toast/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { IconsModule } from './icons/icons.module';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectivityProvider } from '../utils/connectivity.provider';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import OneSignal from 'onesignal-cordova-plugin';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { AppComponent } from './app.component';
import { CallerComponent } from './caller/caller.component';
import { AppRoutingModule } from './app-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
// import { Autostart } from '@ionic-native/autostart/ngx';
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { PowerManagement } from '@ionic-native/power-management/ngx';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Stripe } from '@ionic-native/stripe/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { NativeRingtones } from '@ionic-native/native-ringtones/ngx';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
// import { Push } from '@ionic-native/push/ngx';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { IonicGestureConfig } from '../utils/IonicGestureConfig';
import { pageTransition } from './page-transition';

@NgModule({
  	declarations: [AppComponent, CallerComponent],
  	entryComponents: [],
  	imports: [
  		BrowserModule,
  		BrowserAnimationsModule,
  		IconsModule,
  		FormsModule,
  		// IonicModule.forRoot(),
  		IonicModule.forRoot({ navAnimation: pageTransition }),
  		AppRoutingModule,
	    LoadingBarRouterModule,
	    NgxTippyModule,
  		NgCircleProgressModule.forRoot({
	      	// set defaults here
	      	radius: 100,
	      	outerStrokeWidth: 16,
	      	innerStrokeWidth: 8,
	      	outerStrokeColor: "#78C000",
	      	innerStrokeColor: "#C7E596",
	      	animationDuration: 300
      	}),
	    AngularFireModule.initializeApp(environment.firebase),
	    AngularFireDatabaseModule,
	    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
	],
  	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig},
		Toast,
		AndroidPermissions,
		DatePicker,
 	   	AngularFireDatabase,
 	   	// FirebaseX,
 	   	OneSignal,
 	   	StatusBar,
 	   	SplashScreen,
 	   	SocialSharing,
 	   	Deeplinks,
 	   	Diagnostic,
 	   	// Push,
 	   	Insomnia,
 	   	AudioManagement,
 	   	Camera,
 	   	// ForegroundService,
 	   	// Autostart,
 	   	BackgroundMode,
 	   	InAppBrowser,
 	   	NativeAudio,
 	   	// LocalNotifications,
 	   	NativeRingtones,
 	   	ConnectivityProvider,
 	   	// PowerManagement,
 	   	Stripe
 	   	// Push
	],
  	bootstrap: [AppComponent],
})
export class AppModule {}
