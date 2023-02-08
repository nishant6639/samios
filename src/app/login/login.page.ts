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
declare var VoIPPushNotification;

@Component({
  	selector: 'app-login',
  	templateUrl: './login.page.html',
  	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
	FormModel:any = {};
  	constructor(private misc:MiscService, private platform:Platform, private api:ApiService, private firebase:FirebaseService, private router:Router, private firebasex: FirebaseX) { }

  	ngOnInit() {}

    ionViewWillEnter(){
      this.FormModel = {};
    }
  	ionViewDidEnter() {
      this.misc.setUserDets(null);
      this.misc.backExitSub();
    }

    async loginUser(){
      this.misc.showLoader();
      await OneSignal.promptForPushNotificationsWithUserResponse( (accepted) => {
        console.log("User accepted notifications: " + accepted);
      });
    	var data = this.FormModel;

      ConnectyCube.createSession()
      .then((session) => {
        let userProfile = {
          password: "supersecurepwd",
          email: data['email']
        };
        ConnectyCube.users
        .signup(userProfile)
        .then(async (user) => {
          console.log(user);
          data['calling_id'] = user.user.id;
          // alert(data.calling_id);
          // alert(user.user.id);
          if(this.platform.is('ios')){
            var push = await VoIPPushNotification.init();
            await push.on('registration', (data_v) => {
                console.log("[Ionic] voip registration callback called");
                console.log('voip token is ',data_v.deviceToken);
                //data.deviceToken;
                // voip_token = data_v.deviceToken;
                data['voip_token'] = data_v.deviceToken;
                this.loginUserDo(data);
                //do something with the device token (probably save it to your backend service)
            });
          }
          else{
            this.loginUserDo(data);
          }
        })
        .catch(async(error) => {
          console.log(error);
          let userProfile = {
              password: "supersecurepwd",
              email: data['email']
          };

          ConnectyCube.login(userProfile)
          .then(async (user) => {
            console.log(user);
            data['calling_id'] = user.id;
            if(this.platform.is('ios')){
              var push = await VoIPPushNotification.init();
              // push.on('notification', function(data) {
              //     console.log("[Ionic] notification callback called");
              //     console.log(data);

              //     // do something based on received data
              // });

              push.on('error', function(e) {
                  console.log(e);
              });
              await push.on('registration', (data_v) => {
                  console.log("[Ionic] voip registration callback called");
                  console.log('voip token is ',data_v.deviceToken);
                  //data.deviceToken;
                  // voip_token = data_v.deviceToken;
                  data['voip_token'] = data_v.deviceToken;
                  this.loginUserDo(data);
                  //do something with the device token (probably save it to your backend service)
              });
            }
            else{
              this.loginUserDo(data);
            }
          });
          // this.loginUserDo(data);
        });
      })
      .catch(err => {
        console.log(err);
      })
      // console.log(data);
    }
    loginUserDo(data){
      console.log(data);
      this.platform.ready().then(async () => {
        console.log(this.platform);
        if(this.platform.is('cordova') && (this.platform.is('android') || this.platform.is('ios'))) {
          console.log('dfsfs');
          await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
          let fcm = "";
          await this.firebasex.getToken()
          .then(token => {
            console.log(`The token is ${token}`);
            fcm = token;
          }) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));
          console.log('wait over');
          await OneSignal.getDeviceState(async(state) => {
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
                  // this.router.navigate(['/provider/home']);
                  window.location.href = "/provider/home";
                }
                else{
                  // this.router.navigate(['/home']);
                  window.location.href = "/home";
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
                // this.router.navigate(['/provider/home']);
                window.location.href = "/provider/home";
              }
              else{
                // this.router.navigate(['/home']);
                window.location.href = "/home";
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
