import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
@Component({
  selector: 'app-conf',
  templateUrl: './conf.page.html',
  styleUrls: ['./conf.page.scss'],
})
export class ConfPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  myBackButton(){
    this.location.back();
  }

}
