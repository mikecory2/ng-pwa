import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  // {"publicKey":"BDrKxVtji0Kwq4lZDVvHaOUwW4xvkxZZr3l2GkWTY7Yspm9EyBY34zupS5DwRPDKWmUEprjy7-8oTKBQN6Dd8h4","privateKey":"IVijyCdKV-bRE_9WmJdqrAoeDxo9yvo16jZQqynEJ0c"}

  readonly VAPID_PUBLIC_KEY = 'BDrKxVtji0Kwq4lZDVvHaOUwW4xvkxZZr3l2GkWTY7Yspm9EyBY34zupS5DwRPDKWmUEprjy7-8oTKBQN6Dd8h4'
  constructor(private snackBar: MatSnackBar, private swUpdate: SwUpdate, private swPush: SwPush) { }

  updateNetworkStatusUI() {
    if (navigator.onLine) {
      (document.querySelector('body') as any).style = '';
    } else {
      (document.querySelector('body') as any).style = 'filter: grayscale(1)';
    }
  }
  subscribeToNotifications() {
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => console.log('Success // sub object: ', sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }
  ngOnInit() {
    // Checking SW update status
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        const sb = this.snackBar.open('A new version is available. Load new Version?', 'Update', {duration: 5000})
        sb.onAction().subscribe(() => window.location.reload())
      })
    }

    // Checking Network status
    this.updateNetworkStatusUI()
    window.addEventListener('online', this.updateNetworkStatusUI)
    window.addEventListener('offline', this.updateNetworkStatusUI)

    // Checking installation status
    if ((navigator as any).standalone === false) {
      // This is an iOS device and we're in the browser
      this.snackBar.open('You can add this PWA to your homescreen', '', {duration: 3000})
    }
    if ((navigator as any).standalone === undefined) {
      // It's not iOS
      if (window.matchMedia('(display-mode: browser)').matches) {
        // We're in the browsers
        window.addEventListener('beforeinstallprompt', event => {
          event.preventDefault()
          const sb = this.snackBar.open('Do you want to install this app?', 'Install', {duration: 5000})
          sb.onAction().subscribe(() => {
            (event as any).prompt()
            (event as any).userChoice.then( result => {
              console.log('result: ', result)
              // tslint:disable-next-line:triple-equals
              if (result.outcome == 'dismissed') {
                // TODO: Track no install
                console.log('Dismissed')
              } else {
                // TODO: Track It was installed
                console.log('Installed')
              }
            })
          })
          return false
        })
      }
    }
  }
}
