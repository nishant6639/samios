import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.page.html',
  styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {
	languages:any;
	translate_from:any = 0;
	translate_to:any = 0;
	langSets:any = [];
	langSetsData:any = [];
  langSetKeys:any = [];
	constructor(private misc:MiscService, private api:ApiService, private router:Router) { }

  	ngOnInit() {
  	}
  	ionViewWillEnter() {
	  this.misc.backExitSub();
	  this.getLanguages();
	}

	getLanguages(){
		this.api.getLanguages()
		.then(response =>{
			this.languages = response.data.languages;
			this.translate_from = this.languages[0].id+'*'+this.languages[0].language_name;
			this.translate_to = this.languages[1].id+'*'+this.languages[1].language_name;
		})
		.catch(err => {

		});
	}

	selectLangSet(){
		var from = this.translate_from.split('*');
		var to = this.translate_to.split('*');
		var data = {
			'translate_from': from[0],
			'translate_from_text': from[1],
			'translate_to': to[0],
			'translate_to_text': to[1],
			'exp_level': "1"
		};

		for (var key1 of Object.keys(this.langSets)){
			if(data['translate_from'] == this.langSets[key1]['translate_from'] && data['translate_to'] == this.langSets[key1]['translate_to']){
				// console.log('This language set is already added');
				this.misc.showToast('This language set is already added');
				return;
			}
    }


		var data1 = {
			'translate_from': from[0],
			'translate_to': to[0],
			'exp_level': "1"
		};


		this.langSetsData.push(data1);
		this.langSets.push(data);
		for (var key of Object.keys(this.langSets)) {
			if(Array.isArray(this.langSets[key]['exp_level'])){

			}
			else{
				this.langSets[key]['exp_level'] = (this.langSets[key]['exp_level']).split(',');
			}
    }

	
	}

	delSet(i){
		this.langSets.splice(i, 1);
		this.langSetsData.splice(i, 1);
	}

	addLangDets(){
		var data = {
			'languages': this.langSets
		};



		this.api.addLanguages(data)
		.then(response =>{
			// console.log(response);
			if(response.status == 201){
				this.router.navigate(['/provider/home']);
			}
		})
		.catch(err => {

		});
	}
	
  langSetKeysSet(){
      this.langSetKeys = Object.keys(this.langSets);
  }

	setLangSetExp(key, value){
  	if(value == 0){
  		this.langSets[key]['exp_level'] = ["0"];
  	}
  	else{
    	// console.log(this.langSets[key]['exp_level']);
    	var arr = (this.langSets[key]['exp_level']);
    	value = ""+value;
    	
    	var index = arr.indexOf("0");
    	if(index > -1){
    		arr.splice(index, 1);
    	}

    	index = arr.indexOf(value);
    	if(index > -1){
    		arr.splice(index, 1);
    	}
    	else{
    		arr.push(value);
    	}

    	this.langSets[key]['exp_level'] = arr;

    	// console.log(this.langSets[key]['exp_level']);
  	}

  }

}
