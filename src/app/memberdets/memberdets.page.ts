import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-memberdets',
  templateUrl: './memberdets.page.html',
  styleUrls: ['./memberdets.page.scss'],
})
export class MemberdetsPage implements OnInit {
	show:any = 0;
	member_id:any;
	member:any;
	delPop:any = 0;
	addPop:any = 0;
	FormModel:any = {};
  checkText:any;
  activities:any = [];
  togDis:any = false;
  	constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {

  	}

  	ionViewWillEnter(){
      this.checkText = '';
      this.show = 0;
      this.FormModel = {};
  		this.route.params.subscribe(params => {
	        this.member_id = params['id'];
	        this.getMemberDets();
	    });
  	}

  	getMemberDets(){
  		this.api.getMemberDets(this.member_id)
	    .then( response => {
	        this.member = response.data.member_detail[0];
	        this.member['is_active'] = (this.member['is_active'] == 0)?false:true;
	        this.activities = response.data.activity;
	        this.show = 1;
	    })
	    .catch(err => {
	        this.misc.handleError(err);
	    });
  	}

  	deleteMember(){
  		var ids = this.member.id;
  		var data = {
  			'ids':ids
  		};
  		this.api.deleteMember(data)
  		.then( response => {	        
    		this.router.navigate(['/members']);
	    })
	    .catch(err => {
	        this.misc.handleError(err);
	    });
  	}

    setActType(type){
      if(type == 'all'){
        this.checkText = '';
      }
      if(type == 'hired'){
        this.checkText = 'hired';
      }
      if(type == 'added'){
        this.checkText = 'added';
      }
      if(type == 'removed'){
        this.checkText = 'removed';
      }
    }

    addBalanceToEmployee(){
			if(this.FormModel['credit'] == "" || this.FormModel['credit'] == undefined){
				this.misc.showToast('Enter Amount');
				return;
			}

			this.FormModel['employee_id'] = this.member.id;
			var data = this.FormModel;
			this.api.addFundsToMember(data)
  		.then( response => {
  			this.FormModel = {};
  			this.addPop = 0;
  			this.getMemberDets();
	    })
	    .catch(err => {
	        this.misc.handleError(err);
	    });
    }

    enableDisableUser(event){
    	this.togDis = true;
    	// console.log(event.detail.checked);
    	if(event.detail.checked == false){
    		var is_active = 0;
    	}
    	else{
    		var is_active = 1;
    	}
    	var data = {
    		'user_id': this.member.id,
    		'is_active': is_active
    	};

    	this.api.enableDisableUser(data)
  		.then( response => {
  			this.togDis = false;
	    })
	    .catch(err => {
  			this.togDis = false;
        this.misc.handleError(err);
	    });



    }

}
