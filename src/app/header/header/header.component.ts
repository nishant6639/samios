import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

	userDets:any;
  	constructor(private misc:MiscService, private api:ApiService) {
	  	this.userDets = this.misc.getUserDets();
  	}

  	ngOnInit() {
  		
  	}

}