import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  	selector: 'app-dp',
  	templateUrl: './dp.page.html',
  	styleUrls: ['./dp.page.scss'],
})
export class DpPage implements OnInit {

	prevImg:any = "";
	fd:any;
	user:any;
  	constructor(private router:Router,
  				private route: ActivatedRoute,
  				private misc:MiscService,
  				private api:ApiService,
  				private camera: Camera) { }

  	ngOnInit() {

  	}

  	ionViewWillEnter(){
  		this.user = this.misc.getUserDets();
  		// this.phone_no = this.user.phone_no;
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

		var image = this.dataURItoBlob(this.prevImg);
		// console.log(image);
		var fd= new FormData();
		fd.append('file', image);
		this.api.changeDp(fd)
		.then( resp => {
			if(this.user.user_type == 3){
            	this.router.navigate(['/provider/home']);
            }

            else{
            	this.router.navigate(['/home']);
            }
		})
		.catch( err => {

		});
	}

	skip(){
		if(this.user.user_type == 3){
        	this.router.navigate(['/provider/home']);
        }

        else{
        	this.router.navigate(['/home']);
        }
	}

	readURL(input) {
	  	if (input) {
	    	var reader = new FileReader();
	    
	    	reader.onload = (e) => {
	    		// // console.log(e.target.result);
	      		// $('#blah').attr('src', e.target.result);
	      		this.prevImg = e.target.result;
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


	useCamera(){
		// console.log('abc');
		const options: CameraOptions = {
		  	quality: 30,
		  	destinationType: this.camera.DestinationType.DATA_URL,
		  	encodingType: this.camera.EncodingType.JPEG,
		  	mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
		 	// imageData is either a base64 encoded string or a file URI
		 	// If it's base64 (DATA_URL):
		 	let base64Image = 'data:image/jpeg;base64,' + imageData;
		 	this.prevImg = base64Image;
		}, (err) => {
		 	// Handle error
		});
	}
}
