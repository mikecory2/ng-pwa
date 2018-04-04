import { DataService } from './../data.service';
import { GeolocationService } from './../geolocation.service';
import { Coffee } from './../logic/coffee';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TastingRating } from '../logic/tasting-rating';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.css']
})
export class CoffeeComponent implements OnInit, OnDestroy {

  private routingSubscription: any

  coffee: Coffee
  types: string[]
  tastingEnabled: boolean

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private geoService: GeolocationService, private dataService: DataService, private router: Router) {
    this.types = ['Espresso', 'Ristretto', 'Americano', 'Cappuccino']
    this.tastingEnabled = false
  }

  ngOnInit() {
    this.coffee = new Coffee()
    this.routingSubscription = this.route.params.subscribe(
      params => {
        this.dataService.getCoffee(params['id'], (coffee: Coffee) => {
            this.coffee = coffee;
            (this.coffee.tastingRating) ? this.tastingEnabled = true : this.tastingEnabled = false
          }
        )
      }
    )
    this.geoService.requestLocation((location: Coordinates) => {
      this.coffee.location.lat = location.latitude
      this.coffee.location.long = location.longitude
    })
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe()
  }

  tastingRatingChanged(checked: boolean) {
    if (checked) {
      this.coffee.tastingRating = new TastingRating()
    } else {
      this.coffee.tastingRating = null
    }
  }

  cancel() { this.router.navigate(['/']) }
  save() { this.dataService.save(this.coffee, result => (result) ? this.cancel() : console.log('save failed') ) }

}
