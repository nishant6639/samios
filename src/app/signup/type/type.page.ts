import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../../services/misc.service';
import { ApiService } from '../../services/api.service';

declare var require: any;
const axios = require('axios').default;


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
    constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) { }

    ngOnInit() {
    }

    ionViewWillEnter(){
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
            delete data.confirm_password;
            // // console.log(data);
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
            this.api.registerUser(data)
            .then( response => {
                this.misc.hideLoader();
                // console.log(response);
                var token = response.data.token;
                axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                var user = JSON.stringify(response.data.user);
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('user', user);
                this.misc.setUserDets(user);
                if(data['user_type'] == 3){
                    this.router.navigate(['/otp']);
                }
                else{
                    this.router.navigate(['/otp']);
                }
            })
            .catch(err => {
                this.misc.hideLoader();
                this.misc.handleError(err);
            })
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




    saveCompany(){
        if(this.tnc == 1 && this.pass_flag == 1){
            var data = this.FormModel;
            data['user_type'] = 4;

            if(!(data['reg_id'])){
                this.misc.showToast('Enter Registration Id');
                return;
            }
            // if(!(data['tin_no'])){
            //     this.misc.showToast('Enter Tin No');
            //     return;
            // }
            // data['phone_no'] = data['country_code'] + data['phone_no'];
            // delete data.country_code;
            delete data.confirm_password;
            // console.log(data);
            this.misc.showLoader();
            this.api.registerCompany(data)
            .then( response => {
                this.misc.hideLoader();
                // console.log(response);
                var token = response.data.token;
                axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
                var user = JSON.stringify(response.data.user);
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('user', user);
                this.router.navigate(['/otp']);
            })
            .catch(err => {
                this.misc.hideLoader();
                this.misc.handleError(err);
            })
        }
        else{
            if(!(this.tnc == 1)){
                this.misc.showToast('Please select terms and conditions');
            }
            if(this.pass_flag == 0){
                
            }
        }
    }

}