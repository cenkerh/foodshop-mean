import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  menu: Object;
  deal: Object;
  order: any[];

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {

    this.authService.getMenu().subscribe(shop => {
      this.menu = shop.menu[0].menu;
    }, err => {
      console.log(err);
      return false;
    });
    this.authService.getDeal().subscribe(shop => {
      this.deal = shop.deal[0].deal;
    }, err => {
      console.log(err);
      return false;
    });
    this.authService.getAllOrders().subscribe(shop => {
      this.order = shop.order;
      for (var index = 0; index < this.order.length; index++) {
        this.order[index].orderTime = new Date(this.order[index].orderTime);
      }
    }, err => {
      console.log(err);
      return false;
    });
  }


  addNewMenu(name, price) {
    this.authService.addMenu(name, price).subscribe(menu => {
      this.flashMessage.show('New Menu is added', { cssClass: 'alert-success', timeout: 5000 });
    }, err => {
      console.log(err);
      return false;
    })
  }


  addNewFlashDeal(name1, price1) {
    this.authService.addDeal(name1, price1).subscribe(menu => {
      this.flashMessage.show('New Flash Deal is added', { cssClass: 'alert-success', timeout: 5000 });
    }, err => {
      console.log(err);
      return false;
    })
  }
  onTheWay(item) {
    var status = 'On The Way';
    item.status = status;
    this.authService.putOrder(item._id, status).subscribe(success => {
      this.flashMessage.show('Order is On the way', { cssClass: 'alert-success', timeout: 5000 });
    }, err => {
      console.log(err);
      return false;
    });
  }
  reject(item) {
    var status = 'Rejected';
    item.status = status;
    this.authService.putOrder(item._id, status).subscribe(success => {
      this.flashMessage.show('Order is rejected', { cssClass: 'alert-danger', timeout: 5000 });
    }, err => {
      console.log(err);
      return false;
    });
  }

}
