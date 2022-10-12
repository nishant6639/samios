import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-addmember',
	templateUrl: './addmember.page.html',
	styleUrls: ['./addmember.page.scss'],
})
export class AddmemberPage implements OnInit {
	FormModel:any = {};
	countries:any;
	constructor(private misc:MiscService, private api:ApiService, private router:Router, private route: ActivatedRoute) { }

	ngOnInit() { }

	ionViewWillEnter(){
		this.FormModel = {
			'country_code': '+353'
		};
		this.getCountryList();
	}

	addMember() {

		// console.log("this.FormModel");
		// console.log(this.FormModel);
		if(this.FormModel['name'] == "" || this.FormModel['name'] == undefined){
			this.misc.showToast('Enter name of Employee');
			return;
		}
		if(this.FormModel['email'] == "" || this.FormModel['email'] == undefined){
			this.misc.showToast('Enter email of Employee');
			return;
		}
		if(this.FormModel['country_code'] == "" || this.FormModel['country_code'] == undefined){
			this.misc.showToast('Select Country Code');
			return;
		}
		if(this.FormModel['phone_no'] == "" || this.FormModel['phone_no'] == undefined){
			this.misc.showToast('Enter phone number');
			return;
		}
		if(this.FormModel['credit'] == "" || this.FormModel['credit'] == undefined){
			this.misc.showToast('Enter Credit');
			return;
		}

		this.misc.showLoader();
		var data = this.FormModel;
		// console.log(data);
		this.api.addMember(data)
		.then(response => {
			this.misc.hideLoader();
			this.misc.showToast('User added succesfully. Password is the phone number which has been entered.');
			this.router.navigate(['/members']);
		})
		.catch( err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		});
	}

	getCountryList(){
		this.misc.getCountryList()
		.then( resp => {
				this.countries = resp;
		})
		.catch(err => {

		});
	}

}
