import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
	
	chatMsgs:any = [];
	userDets:any;
	message:any = "";
	selectedScreen:any = 0;
	itemRef: AngularFireObject<any>;
	msgActionShown:any = 0;
  	constructor(private db: AngularFireDatabase,private route: ActivatedRoute, private misc:MiscService) {

    }

  	ngOnInit() { }

  	ionViewWillEnter(){
		  this.selectedScreen = 0;
  		this.userDets = this.misc.getUserDets();
  		this.getChatData();
      if(!(this.route.params == undefined)){
        this.route.params.subscribe(params => {
            if(params['id'] == 1){
              this.selectedScreen = 1;
            }
        });
      }
  	}

  	getChatData(){
    // this.orderId = orderId;
    var userId = this.userDets.id;
    this.chatMsgs = [];
    // console.log('waiting for msgs for user '+userId);
    this.itemRef = this.db.object('chatAdmin/User'+userId+"/messages");
    this.itemRef.snapshotChanges().subscribe(action => {
      // console.log(action.payload.val());

      if(!(action.payload.val() == null)){
        this.chatMsgs = action.payload.val();
        if(!(this.chatMsgs == "")){
          this.chatMsgs = JSON.parse(this.chatMsgs);
          
          var storedChats = window.localStorage.getItem('chats');
          if(!(storedChats== this.chatMsgs)){
            // var elem = document.getElementById("chatPopup");
            // if(elem.classList.contains('active')){
            //   this.msgActionShown = 0;
            // }
            // else{
            //   // console.log('pqr');
            //   this.msgActionShown = 1;
            // }
            window.localStorage.setItem('chats', this.chatMsgs);
          }

          // this.msgActionShown = 1;

        }
        else{
          this.chatMsgs = [];
        }
      }
    });
  }

  sendMsg(){
    var userId = this.userDets.id;

    if(this.message == ""){
      this.misc.showToast('Please enter a message.');
      return;
    }
    
    var data = {
      "message": this.message,
      "from": 'user'
    };
    // console.log(this.chatMsgs);
    this.chatMsgs.push(data);



    var apidata = JSON.stringify(this.chatMsgs);
    const sendRef = this.db.object('chatAdmin/User'+userId+"/messages");
    sendRef.set(apidata);

    const detsRef = this.db.object('chatAdmin/User'+userId+"/details");
    detsRef.set(JSON.stringify(this.userDets));

    this.message = "";
  }

  getUserDetails(){
    this.userDets= this.misc.getUserDets();
    // console.log(this.userDets);
    if(this.userDets != null){
      // this.show = 1;
      this.getChatData();
    }
  }

}
