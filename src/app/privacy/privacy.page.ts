import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  myBackButton(){
    this.location.back();
  }

}
