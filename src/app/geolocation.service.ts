import { PlaceLocation } from './logic/place-location';
import { Injectable } from '@angular/core';

@Injectable()
export class GeolocationService {

  constructor() { }

  requestLocation(callback) {
    // W3C Geo API
    navigator.geolocation.getCurrentPosition(
      position => callback(position.coords),
      error => callback(null)
    )
  }

  getMapLink(location: PlaceLocation) {
    const query = (location.lat) ? `${location.lat},${location.long}` : `${location.address}, ${location.city}`
    return ((/iPad|iPhone|iPod/.test(navigator.userAgent))) ? `https://maps.apple.com/?q=${query}` : `https://maps.google.com/?q=${query}`
  }

}
