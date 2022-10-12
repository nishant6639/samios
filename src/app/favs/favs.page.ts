import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
})
export class FavsPage implements OnInit {
	providers:any;
	userDets:any;
	fav_list:any;
	show:any = 0;
  	constructor(private misc:MiscService, private api:ApiService) { }

  	ngOnInit() { }
  	ionViewWillEnter(){
  		this.show = 0;
  		this.userDets = this.misc.getUserDets();
  		this.getProviders();
  	}
  	getProviders(){
		this.api.getFavProviders()
		.then(response =>{
			// console.log(response);
			this.providers = response.data.users;
			this.providerFavUpd();
			// this.getBookings();
		})
		.catch(err => {

		});
	}

	providerFavUpd(){
		if(!(this.userDets.fav_list == null)){
  			this.fav_list = (this.userDets.fav_list).split(',');
  			// console.log(this.fav_list);
		}
		for (var key of Object.keys(this.providers)) {
			this.providers[key].fav = (this.fav_list).includes((this.providers[key].id).toString());
			// console.log('Adv'+this.providers[key].fav);
		}
		this.show = 1;
	}

	setFav(id, type){
		var data = {
			'id': id,
			'type': type
		};

		this.api.setFav(data)
		.then( resp => {
			if(type == 'add'){
				this.misc.showToast('Provider added to favourite');
			}
			else{
				this.misc.showToast('Provider removed from favourite');
			}
			// console.log(resp);
			this.userDets = resp.data.user;
			this.getProviders();
		})
		.catch(err => {
			// console.log(err);
		})
	}

}
