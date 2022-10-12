import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Shared {
	 Providerorders:any
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
	shared:Shared = {
		Providerorders: []
	};
  	constructor(private api:ApiService) {}

  	getProviderUpcomingCalls(){
  		
  	}




























  	//Miscellaneous
  	



}
