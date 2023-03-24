import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../../services/misc.service';
import { Platform } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import OneSignal from 'onesignal-cordova-plugin';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

declare var require: any;
const axios = require('axios').default;
declare let ConnectyCube:any;


@Component({
    selector: 'app-type',
    templateUrl: './type.page.html',
    styleUrls: ['./type.page.scss'],
})
export class TypePage implements OnInit {

    user_type:any = "";
    popup:any = {
        'avail': 0
    };
    daysValArr:any = ["0","1","2","3","4","5","6"];
    days:any = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];
    FormModel:any = {
        country_code:"+353",
        country_id:"Ireland"
    };
    tnc:any = 0;
    countries:any;
    pass_flag:any = 0;
    daysel:any;
    pass_meter_width:any = 0;
    availabilities:any = {};
    availCheckList:any = [];
    companyTypes:any = [];
    passShow:any = 0;
    constructor(private router:Router,
        private platform:Platform,
        private route: ActivatedRoute,
        private misc:MiscService,
        private api:ApiService,
        private firebasex:FirebaseX
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter(){
        this.passShow = 0;
        this.route.params.subscribe(params => {
            this.user_type = params['type'];
            this.getCountryList();
            this.getCompanyTypes();
        });
    }

    ionViewDidEnter() {

    }


    getCountryList(){
        this.misc.getCountryList()
        .then( resp => {
            this.countries = resp;
        })
        .catch(err => {

        });
    }

    getCompanyTypes(){
        this.api.getCompanyTypes()
        .then( response => {
            this.companyTypes = response.data.types;
        })
        .catch(err => {
            
        })
    }

    tncCheck(){
        this.tnc = (this.tnc == 0)?1:0;
    }

    saveUser(){
        if(this.tnc == 1 && this.pass_flag == 1){
            var data = this.FormModel;
            if(this.user_type == 'interpreter'){
                data['user_type'] = 3;
            }
            else{
                data['user_type'] = 2;
            }
            // data['phone_no'] = data['country_code'] + data['phone_no'];
            // delete data.country_code;
            // // console.log(data);
            ConnectyCube.createSession()
            .then((session) => {
                const userProfile = {
                    password: "supersecurepwd",
                    email: data['email']
                };
                ConnectyCube.users
                .signup(userProfile)
                .then((user) => {
                    data['calling_id'] = user.user.id;
                    this.saveUserDo(data);
                })
                .catch((error) => {
                    this.saveUserDo(data);
                });
            });
        }
        else{
            if(!(this.tnc == 1)){
                this.misc.showToast('Please select terms and conditions');
            }
            if(this.pass_flag == 0){
                this.misc.showToast('Password and confirm password does not match.');
            }
        }
    }

    saveUserDo(data){
        if(this.user_type == 'interpreter'){
            // // console.log(this.availCheckList);
            Object.keys(this.availabilities).forEach( (key) => {
                // // console.log(key);
                if(!(this.availCheckList.includes(key))) {
                    delete this.availabilities[key];
                    // this.availabilities.splice(key, 1);
                }
            });
            data['availabilities'] = this.availabilities;
            // console.log(Object.keys(this.availabilities).length);
            if(Object.keys(this.availabilities).length == 0){
                // // console.log('empty');
                this.misc.showToast('Enter availabilities');
                return;
            }
        }
        // // console.log(data);
        this.misc.showLoader();
        this.platform.ready().then(async () => {
            if(this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) {

                await OneSignal.promptForPushNotificationsWithUserResponse( (accepted) => {
                    console.log("User accepted notifications: " + accepted);
                });
                let fcm = "";
                await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
                await this.firebasex.getToken()
                .then(token => {
                    console.log(`The token is ${token}`);
                    fcm = token;
                }) // save the token server-side and use it to push notifications to this device
                await OneSignal.getDeviceState((state) => {
                  // console.log(state.userId);
                    if(state.userId == undefined){
                      this.saveUser();
                      return;
                    }
                    delete data.confirm_password;
                    data['fcm'] = state.userId;
                    data['fcm_call'] = fcm;
                    this.api.registerUser(data)
                    .then( response => {
                        this.misc.hideLoader();
                        // console.log(response);
                        // var token = response.data.token;
                        // axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                        // var user = JSON.stringify(response.data.user);
                        // window.localStorage.setItem('token', token);
                        // window.localStorage.setItem('user', user);
                        // this.misc.setUserDets(user);
                        if(data['user_type'] == 3){
                            this.router.navigate(['/login']);
                        }
                        else{
                            this.router.navigate(['/login']);
                        }
                    })
                    .catch(err => {
                        this.misc.hideLoader();
                        this.misc.handleError(err);
                    });
                });
            }
            else{
                delete data.confirm_password;
                this.api.registerUser(data)
                .then( response => {
                    this.misc.hideLoader();
                    // console.log(response);
                    // var token = response.data.token;
                    // axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                    // var user = JSON.stringify(response.data.user);
                    // window.localStorage.setItem('token', token);
                    // window.localStorage.setItem('user', user);
                    // this.misc.setUserDets(user);
                    if(data['user_type'] == 3){
                        this.router.navigate(['/login']);
                    }
                    else{
                        this.router.navigate(['/login']);
                    }
                })
                .catch(err => {
                    this.misc.hideLoader();
                    this.misc.handleError(err);
                });
            }
        });
    }


    passwordCheck(){
        if(this.FormModel.password == this.FormModel.confirm_password){
            this.pass_flag = 1;
        }
        else{
            this.pass_flag = 0;
        }

        this.pass_meter_width = 0;


        if((this.FormModel.password).length > 8){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[A-Z]/.test(this.FormModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[0-9]/.test(this.FormModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        if(/[^A-Z a-z0-9]/.test(this.FormModel.password)){
            this.pass_meter_width = this.pass_meter_width + 25;
        }

        // // console.log((this.FormModel.password).length);
        // // console.log(/[A-Z]/.test(this.FormModel.password));
        // // console.log(/[0-9]/.test(this.FormModel.password));

    }

    selectDateFor(day){
        this.daysel = day;
        this.popup.avail = 1;
    }


    addDate(event){

        // var avail_arr = this.availabilities;

        // event['day'] = this.daysel;

        var this_day_val = {};

        this_day_val['day'] = this.daysel;
        this_day_val['start_time'] = event.start_time;
        this_day_val['end_time'] = event.end_time;
        
        // // console.log(this_day_val);

        // avail_arr.push(this_day_val);
        this.availabilities[this.daysel] = this_day_val;

        // console.log(this.availabilities);

        this.popup.avail = 0;
    }

    availCheck(key){
        if(this.availCheckList.includes(key)){
            var index = this.availCheckList.indexOf(key);
            if (index !== -1) {
              this.availCheckList.splice(index, 1);
            }
        }
        else{
           this.availCheckList.push(key);
        }

        // console.log(this.availCheckList);
    }




    async saveCompany(){
        if(this.tnc == 1 && this.pass_flag == 1){
            var data = this.FormModel;
            data['user_type'] = 4;

            if(!(data['reg_id'])){
                this.misc.showToast('Enter Registration Id');
                return;
            }
            const userProfile = {
                password: "supersecurepwd",
                email: data['email']
            };
            ConnectyCube.createSession()
            .then((session) => {
                ConnectyCube.users
                .signup(userProfile)
                .then((user) => {
                    data['calling_id'] = user.user.id;
                    this.saveCompanyDo(data);
                })
                .catch((error) => {
                    this.saveCompanyDo(data);
                });
            });
            // if(!(data['tin_no'])){
            //     this.misc.showToast('Enter Tin No');
            //     return;
            // }
            // data['phone_no'] = data['country_code'] + data['phone_no'];
            // delete data.country_code;
            // console.log(data);
        }
        else{
            if(!(this.tnc == 1)){
                this.misc.showToast('Please select terms and conditions');
            }
            if(this.pass_flag == 0){
                
            }
        }
    }

    saveCompanyDo(data){
        this.misc.showLoader();
        this.platform.ready().then(async () => {
            if(this.platform.is('cordova')){
                await OneSignal.promptForPushNotificationsWithUserResponse( (accepted) => {
                    console.log("User accepted notifications: " + accepted);
                });
                let fcm = "";
                await OneSignal.setAppId("c9b34fe5-7aa3-47e6-864e-a526a56333d7");
                await this.firebasex.getToken()
                .then(token => {
                    console.log(`The token is ${token}`);
                    fcm = token;
                }) // save the token server-side and use it to push notifications to this device
                await OneSignal.getDeviceState((state) => {
                    // console.log(state.userId);
                    if(state.userId == undefined){
                      this.saveCompany();
                      return;
                    }
                    delete data.confirm_password;
                    data['fcm'] = state.userId;
                    data['fcm_call'] = fcm;
                    this.api.registerCompany(data)
                    .then( response => {
                        this.misc.hideLoader();
                        // console.log(response);
                        // var token = response.data.token;
                        // axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                        // var user = JSON.stringify(response.data.user);
                        // window.localStorage.setItem('token', token);
                        // window.localStorage.setItem('user', user);
                        this.router.navigate(['/login']);
                    })
                    .catch(err => {
                        this.misc.hideLoader();
                        this.misc.handleError(err);
                    })
                });
            }
            else{
                delete data.confirm_password;
                this.api.registerCompany(data)
                .then( response => {
                    this.misc.hideLoader();
                    // console.log(response);
                    // var token = response.data.token;
                    // axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                    // var user = JSON.stringify(response.data.user);
                    // window.localStorage.setItem('token', token);
                    // window.localStorage.setItem('user', user);
                    this.router.navigate(['/login']);
                })
                .catch(err => {
                    this.misc.hideLoader();
                    this.misc.handleError(err);
                });
            }
        });
    }

}