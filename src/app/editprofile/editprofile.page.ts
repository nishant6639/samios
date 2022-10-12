import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  	selector: 'app-editprofile',
  	templateUrl: './editprofile.page.html',
  	styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {

	userDets:any;
	countries:any;
	show:any = 0;
	langSetKeys:any = [];
	prevImg:any;
	daysValArr:any = ["0","1","2","3","4","5","6"];
    days:any = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];
    daysel:any;
	FormModel:any = {
		'country_code': '+353'
	};
	popup:any = {
        'avail': 0
    };
	availCheckList:any = [];
	revModel:any = {};
	translate_from:any;
	translate_to:any;
	availabilities:any = {};
	languages:any = [];
	provider:any = [];
	activeSection:any = "personal";
	langSets:any = {
		set:{}
	};
	langSetsData:any = [];
	reviews:any = [];
  	constructor(private router:Router, private route: ActivatedRoute, private misc:MiscService, private api:ApiService) {
  	}

  	ngOnInit() {

  	}

  	ionViewWillEnter(){
  		this.show = 0;
    	this.availCheckList = [];
    	this.availabilities = {};
  		this.activeSection = "personal";
  		this.userDets = this.misc.getUserDets();
		this.FormModel = this.userDets;
		this.getCountryList();
		this.getLanguages();
	}

	getLanguages(){
		this.api.getLanguages()
		.then(response =>{
			this.languages = response.data.languages;
			this.translate_from = this.languages[0].id+'*'+this.languages[0].language_name;
			this.translate_to = this.languages[1].id+'*'+this.languages[1].language_name;
			if(this.userDets.user_type == 3){
				this.getServProvData();
				this.getAvail();
			}
			else{
				this.show = 1;
			}
		})
		.catch(err => {

		});
	}


	getAvail(){

        this.api.getAvail()
        .then( resp => {
        	var avail = resp.data.avail;
            // this.availabilities = resp.data.avail;
            Object.keys(avail).forEach((key) => {
            	this.availCheckList.push(avail[key].day);
            	this.availabilities[avail[key].day] = avail[key];
            })
        })
        .catch(err => {

        });
    }

    getServProvData(){

        this.api.getProviderData()
        .then( resp => {
            this.provider = resp.data.avail;
            this.langSets = resp.data.languages;
            this.langSetKeysSet();
            for (var key of Object.keys(this.langSets)) {
            	this.langSets[key]['exp_level'] = (this.langSets[key]['exp_level']).split(',');
            }
            this.reviews = resp.data.reviews;
			this.show = 1;
        })
        .catch(err => {

        });
    }

    delAvail(id){
    	this.api.delAvail(id)
        .then( resp => {
        	this.getAvail();
        })
        .catch(err => {

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



	selectLangSet(){
		var from = this.translate_from.split('*');
		var to = this.translate_to.split('*');
		var data = {
			'translate_from': from[0],
			'language_from_name': from[1],
			'translate_to': to[0],
			'language_to_name': to[1],
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


		this.langSetKeysSet();
	
	}

	delSet(i){
		this.langSets.splice(i, 1);
		this.langSetsData.splice(i, 1);
		this.langSetKeysSet();
	}

	langSetKeysSet(){
		this.langSetKeys = Object.keys(this.langSets);
	}


	addLangDets(){
		var data = {
			'languages': this.langSets,
			'about': this.FormModel.about,
			'experience_text': this.FormModel.experience_text,
		};


		// console.log(this.langSets);
		// return;



		this.api.addLanguages(data)
		.then(response =>{
			// console.log(response);
			if(response.status == 201){
				// this.router.navigate(['/provider/home']);
				this.misc.showToast('Languages updated succesfully');
				this.getLanguages();
			}
		})
		.catch(err => {

		});
	}

    saveUser(){
    	// console.log(this.availabilities);
    	// return;
    	var data = {
    		'personal':this.FormModel
    	};

        Object.keys(this.availabilities).forEach( (key) => {
            // // console.log(key);
            if(!(this.availCheckList.includes(key))) {
                delete this.availabilities[key];
                // this.availabilities.splice(key, 1);
            }
        });

        data['availabilities'] = this.availabilities;
        // // console.log(this.availabilities);
        // return;
        this.misc.showLoader();
    	this.api.updateUser(data)
        .then( resp => {
        	this.misc.showToast('Profile updated succesfully');
        	this.router.navigate(['/profile']);
    		this.misc.hideLoader();
        })
        .catch(err => {
    		this.misc.handleError(err);
    		this.misc.hideLoader();

        });
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

    	this.langSetKeysSet();

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

    onDpChange(files){
		
		// var fd= new FormData();
		
		let newDp = files[0];
		
		// console.log(newDp);
		
		if(!(newDp == "")){
		
			// fd.append('file', newDp);
			this.readURL(newDp);
			// var imgHolder = document.getElementById('userDp');
			// imgHolder.attr('src', );
			// this.userDets.image_url = URL.createObjectURL(newDp);
			// this.presentLoading();
		}
	}

	saveImage(){
		this.misc.showLoader();
		var image = this.dataURItoBlob(this.prevImg);
		// console.log(image);
		var fd= new FormData();
		fd.append('file', image);
		this.api.changeDp(fd)
		.then( resp => {
			this.misc.hideLoader();
        	this.router.navigate(['/profile']);
		})
		.catch( err => {
			this.misc.handleError(err);
    		this.misc.hideLoader();
		});
	}

	skip(){

	}

	readURL(input) {
	  	if (input) {
	    	var reader = new FileReader();
	    
	    	reader.onload = (e) => {
	    		// // console.log(e.target.result);
	      		// $('#blah').attr('src', e.target.result);
	      		this.prevImg = e.target.result;
	      		this.saveImage();
	    	}
	    
	    	reader.readAsDataURL(input); // convert to base64 string
	  	}
	}

	dataURItoBlob(dataURI) {
	    // convert base64 to raw binary data held in a string
	    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	    var byteString = atob(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to an ArrayBuffer
	    var ab = new ArrayBuffer(byteString.length);
	    var ia = new Uint8Array(ab);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    //Old Code
	    //write the ArrayBuffer to a blob, and you're done
	    //var bb = new BlobBuilder();
	    //bb.append(ab);
	    //return bb.getBlob(mimeString);

	    //New Code
	    return new Blob([ab], {type: mimeString});


	}

	saveReviewResponse(review_id){
		if(this.revModel.response == ""){
			this.misc.showToast('Enter Response text');
			return false;
		}
		var data = {
			'id': review_id,
			'interpreter_response': this.revModel.response
		};
		this.api.updateReviewResponse(data)
		.then(resp => {
			this.misc.hideLoader();
				this.misc.showToast('Response submitted succesfully');
				this.getLanguages();
		})
		.catch(err => {
			this.misc.hideLoader();
			this.misc.handleError(err);
		})
		// console.log(data);
	}



}
