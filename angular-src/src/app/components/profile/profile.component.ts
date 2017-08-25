import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;
  order: Object;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });
    this.authService.getOrders().subscribe(profile => {
      this.order = profile.orders;
    },
      err => {
        console.log(err);
        return false;
      });
  }
  takeOrder(item){
    var status = 'Order is taken';
    item.status = status;
    this.authService.putOrder(item._id,status).subscribe(success => {
      this.flashMessage.show('Order is taken', { cssClass: 'alert-success', timeout: 5000 });
    },err => {
      console.log(err);
      return false;
    });
  }
  cancelOrder(item){
    var status = 'Canceled';
    item.status = status;
    this.authService.putOrder(item._id,status).subscribe(success => {
      this.flashMessage.show('Order is canceled', { cssClass: 'alert-danger', timeout: 5000 });
    },err => {
      console.log(err);
      return false;
    });
  }

}
