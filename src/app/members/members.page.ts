import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {
	members:any;
	sel_for_del:any = [];
	show:any = 0;
  	constructor(private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {
  	}

	ionViewWillEnter(){
		this.members = [];
		this.sel_for_del = [];
  		this.getMembers();
  	}

  	getMembers(){
  		this.api.getMembers()
		.then(response => {
			this.members = response.data.member_list;
        for (var key of Object.keys(this.members)) {
    			if(this.sel_for_del.includes(this.members[key].id)){
    				this.members[key]['toDel'] = 1;
    			}
    			else{
    				this.members[key]['toDel'] = 0;
    			}
        }
        this.show = 1;
	        // this.misc.hideLoader();
			// this.misc.showToast('User added succesfully');
			// this.router.navigate(['/members']);
		})
		.catch( err => {
	        // this.misc.hideLoader();
	        this.misc.handleError(err);
		});
  	}

  	selectUserForDelete(user_id){
  		if(this.sel_for_del.includes(user_id)){
  			var index = this.sel_for_del.indexOf(user_id);
			if (index !== -1) {
			  this.sel_for_del.splice(index, 1);
			}
  		}
  		else{
  			this.sel_for_del.push(user_id);
  		}
  		// console.log(user_id);
  		for (var key of Object.keys(this.members)) {
  			if(this.sel_for_del.includes(this.members[key].id)){
  				this.members[key]['toDel'] = 1;
  			}
  			else{
  				this.members[key]['toDel'] = 0;
  			}
  		}
  	}

  	deleteUsers(){
	    this.misc.showLoader();
  		// var data = {
  		// 	userList: this.sel_for_del
  		// };
  		// this.deleteMultiMembers(data)
  		// .then(response => {
  		// 	this.misc.hideLoader();
  		// 	this.getMembers();
  		// })
  		// .catch(err => {
  		// 	this.misc.hideLoader();
  		// 	this.misc.handleError(err);
  		// 	this.misc.showToast('User added succesfully');
  		// });
  		var ids = this.sel_for_del.join(",");
  		var data = {
  			'ids':ids
  		};
  		this.api.deleteMember(data)
  		.then( response => {
  			this.misc.showToast('Members deleted succesfully');
  			this.misc.hideLoader();
  			this.getMembers();	        
    		// this.router.navigate(['/members']);
	    })
	    .catch(err => {
  			this.misc.hideLoader();
	        this.misc.handleError(err);
	    });
  	}

  	doRefresh(event) {
	    // console.log('Begin async operation');
	    this.ionViewWillEnter();
	    event.target.disabled = true;
	    event.target.complete();
	    setTimeout(() => {
	      event.target.disabled = false;
	    }, 1000);
	  }
}