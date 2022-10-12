import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  FormModel:any = {};
  pass_flag:any = 0;
  pass_meter_width:any = 0;
  
  constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.FormModel = {};
    this.pass_flag = 0;
    this.pass_meter_width = 0;
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

  changePw(){
    if(this.pass_flag == 1){
      var data_change = {
        'password': this.FormModel['password']
      };
      this.misc.showLoader();
      this.api.changePwAuth(data_change)
      .then( resp => {
          this.misc.hideLoader();
          // // console.log();
          this.misc.showToast('Password Changed. Redirecting..');
          // // console.log(resp);
          this.router.navigate(['/']);
      })
      .catch(err => {
          this.misc.hideLoader();
          this.misc.handleError(err);
      });
    }
  }

}
