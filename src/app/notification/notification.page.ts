import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

		notes:any;
		userDets:any = [];
		show:any = 0;
		showLoadMore:any = 0;
		showMoreLoad:any = 0;
		offset:any = 0;
  	constructor(private misc:MiscService, private api:ApiService) {
  	}

  	ngOnInit() { }


  	ionViewWillEnter() {
  		this.show = 0;
  		this.offset = 0;
  		this.userDets = this.misc.getUserDets();
  		this.notes = [];
	  this.getNotes();
	}

	getNotes(){
		this.api.getNotes()
		.then(response =>{
			this.notes = response.data.activities;
			for (var key of Object.keys(this.notes)) {
				this.notes[key]['created_at'] = (new Date((this.notes[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
			}

			if(response.data.total_notes > 10){
				this.showLoadMore = 1;
			}

			this.show = 1;
		})
		.catch(err => {

		});
	}

	getMoreNotes(){
		this.showMoreLoad = 1;
		this.offset++;
		var data = {
			'offset': this.offset
		};
		this.api.getMoreNotes(data)
		.then(response =>{
				var new_notes = response.data.activities;
				// console.log(new_notes);
				for (var key of Object.keys(new_notes)) {
					new_notes[key]['created_at'] = (new Date((new_notes[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
				}

			this.notes = (this.notes).concat(new_notes);
				// console.log(this.notes);
				this.showMoreLoad = 0;
				var total_notes = response.data.total_notes;

				if(total_notes > ((this.offset + 1) * 10)){
					this.showLoadMore = 1;
				}
				else{
					this.showLoadMore = 0;
				}
		})
		.catch(err => {
			this.showMoreLoad = 0;
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
