import { Coffee } from './logic/coffee';
import { PlaceLocation } from './logic/place-location';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  endpoint = '//localhost:3000'

  constructor(private http: HttpClient) { }

  getList(callback) {
    // const list = [
    //   new Coffee('Double Espresso', 'Sunny Cafe', new PlaceLocation('123 Market Street', 'San Fransico')),
    //   new Coffee('Caramel Americano', 'StarCoffee', new PlaceLocation('Gran Via 34', 'Madrid')),
    // ]
    this.http.get(`${this.endpoint}/coffees`).subscribe(
      response => {
        callback(response)
      }
    )
  }

  getCoffee(coffeeId: string, callback) {
    this.http.get(`${this.endpoint}/coffees/${coffeeId}`).subscribe(
      response => callback(response)
    )
  }

  save(coffee: Coffee, callback) {
    if (coffee._id) {
      // update
      this.http.put(`${this.endpoint}/coffees/${coffee._id}`, coffee).subscribe(
        response => callback(true)
      )
    } else {
      // insert
      this.http.post(`${this.endpoint}/coffees`, coffee).subscribe(
        response => callback(true)
      )
    }
  }

}
