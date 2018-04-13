import { GeolocationService } from './../geolocation.service';
import { Router } from '@angular/router';
import { Coffee } from './../logic/coffee';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Coffee>;
  items: Observable<Coffee[]>;

  constructor(private afs: AngularFirestore, private router: Router, private geoService: GeolocationService) {
    this.itemsCollection = afs.collection<Coffee>('coffees');

    // Does not havd id data
    // this.items = this.itemsCollection.valueChanges();

    // This calls has meta data like the id, which we need.
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Coffee;
        data._id = a.payload.doc.id;
        return { ...data };
      });
    });
  }

  ngOnInit() { }

  goToDetails(coffee: Coffee) {
    this.router.navigate(['/coffee', coffee._id])
  }

  goToMap(coffee: Coffee) {
    location.href = this.geoService.getMapLink(coffee.location)
  }

  shareCoffee(coffee: Coffee) {
    const shareText = `I had this coffee at ${coffee.place} and for me it's a ${coffee.rating} star coffee.`
    if ('share' in navigator) {
      (navigator as any).share({
        title: coffee.name,
        text: shareText,
        url: window.location.href
      }).then(() => console.log('Shared')).catch(() => console.log('Error Sharing'))
    } else {
      location.href = `whatsapp://send?text=${encodeURIComponent(shareText)}`
    }
  }

}
