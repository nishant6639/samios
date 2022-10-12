import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  	selector: 'app-activity',
  	templateUrl: './activity.page.html',
  	styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
	activities:any;
  jobs:any;
  total_amount:any;
  userDets:any;
  show:any = 0;
  allactivities:any;
  checkText:any = " ";
  showLoadMore:any = 0;
  showMoreLoad:any = 0;
  offset:any = 0;
  	constructor(private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {
  	}

  	ionViewWillEnter(){
      this.show = 0;
      this.checkText = '';
      this.userDets = this.misc.getUserDets();
  		this.getActivities();
  	}


  	getActivities(){
      var data = {
        'type': this.checkText
      };
  		this.api.getActivities(data)
  		.then(response =>{
        this.offset = 0;
        this.showMoreLoad = 0;
        this.activities = response.data.activities;
        for (var key of Object.keys(this.activities)) {
          this.activities[key]['created_at'] = (new Date((this.activities[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
        }
        this.allactivities = this.activities;
        if(response.data.activities_count > 10){
          this.showLoadMore = 1;
        }
        else{
          this.showLoadMore = 0;
        }
        this.jobs = response.data.jobs;
  			this.total_amount = response.data.total_amount;
        this.show = 1;
  		})
  		.catch(err => {
        this.showMoreLoad = 0;
  		});
  	}

    loadMoreActivities(){
      this.offset++;
      this.showMoreLoad = 1;
      var data = {
        'offset': this.offset,
        'type': this.checkText
      };
      this.api.loadMoreActivities(data)
      .then(response =>{
        var new_acts = response.data.activities;
        for (var key of Object.keys(new_acts)) {
          new_acts[key]['created_at'] = (new Date((new_acts[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
        }
        this.activities = (this.activities).concat(new_acts);
        this.showMoreLoad = 0;
        if(response.data.activities_count > ((this.offset+ 1) * 10)){
          this.showLoadMore = 1;
        }
        else{
          this.showLoadMore = 0;
        }
        // this.activities = response.data.activities;
        // for (var key of Object.keys(this.activities)) {
        //   this.activities[key]['created_at'] = (new Date((this.activities[key]['created_at']+" UTC").replace(/-/g, '/'))).toISOString();
        // }
        // this.allactivities = this.activities;
        // this.jobs = response.data.jobs;
        // this.total_amount = response.data.total_amount;
        // this.show = 1;

      })
      .catch(err => {
        this.showMoreLoad = 0;
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
      this.activities = [];
      this.showMoreLoad = 1;
      this.getActivities();
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
