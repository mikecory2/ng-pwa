import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { GeolocationService } from './../geolocation.service';
import { Coffee } from './../logic/coffee';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TastingRating } from '../logic/tasting-rating';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.css']
})
export class CoffeeComponent implements OnInit, OnDestroy {

  private routingSubscription: any

  coffee: Coffee
  private itemDoc: AngularFirestoreDocument<Coffee>
  private itemsCollection: AngularFirestoreCollection<Coffee>;
  types: string[]


  // tslint:disable-next-line:max-line-length
  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private geoService: GeolocationService, private router: Router) {
    this.types = ['Espresso', 'Ristretto', 'Americano', 'Cappuccino']
    this.itemsCollection = afs.collection<Coffee>('coffees');
  }

  ngOnInit() {
    this.coffee = new Coffee()
    this.routingSubscription = this.route.params.subscribe(
      params => {
        if (params['id']) {
          console.log('Params: ', params)
          this.itemDoc = this.afs.doc<Coffee>(`coffees/${params['id']}`);
          this.itemDoc.valueChanges().subscribe(coffee => this.coffee = coffee)
        }
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

  cancel() {
    this.router.navigate(['/'])
  }
  save() {
    const data = JSON.parse(JSON.stringify(this.coffee));
    if (this.itemDoc) {
      this.itemDoc.update(data).then(() => this.cancel()).catch(() => console.log('update failed'))
    } else {
      this.itemsCollection.add(data).then(() => this.cancel()).catch(() => console.log('save failed'))
    }
  }

}
