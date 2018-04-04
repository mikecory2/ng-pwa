import { GeolocationService } from './../geolocation.service';
import { Router } from '@angular/router';
import { Coffee } from './../logic/coffee';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list: Coffee[]

  constructor(private data: DataService, private router: Router, private geoService: GeolocationService) { }

  ngOnInit() {
     this.data.getList(list => {
       this.list = list
     })
  }

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
