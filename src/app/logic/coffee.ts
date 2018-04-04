import { PlaceLocation } from './place-location';
import { TastingRating } from './tasting-rating';

export class Coffee {
  _id: string
  type: string
  rating: number
  notes: string
  tastingRating: TastingRating

  constructor(public name?: string, public place?: string, public location?: PlaceLocation) {
    if (!location) {this.location = new PlaceLocation()}
  }
}
