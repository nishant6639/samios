import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.page.html',
  styleUrls: ['./tnc.page.scss'],
})
export class TncPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  myBackButton(){
    this.location.back();
  }

}
