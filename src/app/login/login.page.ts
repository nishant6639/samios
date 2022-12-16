import { Component, OnInit, OnDestroy } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { FirebaseService } from '../services/firebase.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import OneSignal from 'onesignal-cordova-plugin';
import { Router } from '@angular/router';

declare const ConnectyCube:any;
declare var require: any;
const axios = require('axios').default;

@Component({
  	selector: 'app-login',
  	templateUrl: './login.page.html',
  	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
	FormModel:any = {};
  	constructor(private misc:MiscService, private platform:Platform, private api:ApiService, private firebase:FirebaseService, private router:Router, private firebasex: FirebaseX) { }

  	ngOnInit() {

  	}

    ionViewWillEnter(){
      this.FormModel = {};
    }
  	ionViewDidEnter() {
      this.misc.backExitSub();
    }

    async loginUser(){
    	var data = this.FormModel;
      const userProfile = {
          password: "supersecurepwd",
          email: data['email']
      };
      ConnectyCube.users
      .signup(userProfile)
      .then((user) => {
        console.log(user);
        data['calling_id'] = user.user.id;
        // alert(data.calling_id);
        // alert(user.user.id);
        this.loginUserDo(data);
      })
      .catch((error) => {
        console.log(error);
        this.loginUserDo(data);
      });
      // console.log(data);
    }
    loginUserDo(data){
      this.misc.showLoader();
      this.platform.ready().then(async () => {
        console.log(this.platform);
        if(this.platform.is('cordova') && (this.platform.is('android') || this.platform.is('ios'))) {
          console.log('dfsfs');
          await OneSignal.promptForPushNotificationsWithUserResponse( (accepted) => {
            console.log("User accepted notifications: " + accepted);
          });
          await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
          let fcm = "";
          await this.firebasex.getToken()
          .then(token => {
            console.log(`The token is ${token}`);
            fcm = token;
          }) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));
          console.log('wait over');
          await OneSignal.getDeviceState((state) => {
            console.log(state.userId);
            if(state.userId == undefined){
              this.loginUserDo(data);
              return;
            }
            data['fcm'] = state.userId;
            data['fcm_call'] = fcm;
            this.api.loginUser(data)
            .then( response => {
                this.misc.hideLoader();
                var token = response.data.access_token;
                var user = JSON.stringify(response.data.user);
                axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('user', user);
                this.misc.setUserDets(user);
                if(response.data.user.user_type == 3){
                  this.router.navigate(['/provider/home']);
                }
                else{
                  this.router.navigate(['/home']);
                }
            })
            .catch(err => {
                this.misc.hideLoader();
                this.misc.handleError(err, 'login');
            });
          });
        }
        // }
        else{
          this.api.loginUser(data)
          .then( response => {
              this.misc.hideLoader();
              var token = response.data.access_token;
              var user = JSON.stringify(response.data.user);
              axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
              window.localStorage.setItem('token', token);
              window.localStorage.setItem('user', user);
              this.misc.setUserDets(user);
              if(response.data.user.user_type == 3){
                this.router.navigate(['/provider/home']);
              }
              else{
                this.router.navigate(['/home']);
              }
          })
          .catch(err => {
              this.misc.hideLoader();
              this.misc.handleError(err, 'login');
          });
        }
      });
    }

    ionViewWillLeave(){
      this.misc.backExitUnsub();
    }

    ngOnDestroy(){
    //   this.misc.backExitUnsub();
    }

}
