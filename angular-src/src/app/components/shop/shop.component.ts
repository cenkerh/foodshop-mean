import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  menu: Object;
  deal: Object;
  basket: any[];
  total: number;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.basket = [];
    this.total = 0;
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
    
  }

  addToBasket(order) {
    this.basket.push(order);
    this.totalPrice();
  }

  deleteFromBasket(order) {
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i] == order) {
        this.basket.splice(i, 1);
        break;
      }
    }
    this.totalPrice();
  }
  totalPrice() {
    this.total = 0;
    for (var index = 0; index < this.basket.length; index++) {
      this.total += Number(this.basket[index].price);
      console.log(this.total);
    }
  }
  sendOrder() {
    if (this.basket.length > 0) {
      this.authService.postOrder(this.basket).subscribe(data => {
        if (data.success) {
          this.flashMessage.show('Your order has been set', { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate(['/profile']);
        }
        else {
          this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });
        }
      }, err => {
        console.log(err);
        return false;
      });
    }
  }

}
