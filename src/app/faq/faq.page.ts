import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
	faqs:any = [];
	selectedFaq:any = -1;
	show:any = 0;
  	constructor(private misc:MiscService, private api:ApiService) { }

  	ngOnInit() {
  	}

  	ionViewWillEnter(){
		this.getFaqs();
	}

	getFaqs(){
		this.api.getFaqs()
		.then(response =>{
			this.show = 1;
			this.faqs = response.data.faq;
		})
		.catch(err => {

		});
	}

}
