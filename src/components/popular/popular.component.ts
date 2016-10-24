import { Component, OnInit } from '@angular/core'
import { StateService } from '../state/state.service'
import { Router } from '@angular/router'
import { PopularApiService } from '../api/popular.service'
import { popularGalleriesMock } from './popular-galleries.mock'

@Component({
    selector: 'atg-popular',
    templateUrl: 'components/popular/popular.component.html',
    styleUrls: ['components/popular/popular.component.css'],
    providers: [ PopularApiService ]
})
export class PopularComponent implements OnInit {
  public popularItems = popularGalleriesMock

  constructor (
    private popularApiService: PopularApiService,
    private stateService: StateService,
    private router: Router
  ) { }

  ngOnInit () {
    this.popularApiService
      .getPopular()
      .subscribe(
        data => this.popularItems = data
      )
  }

  selectGallery (user) {
    let username = user.username;
    this.stateService.setKey('selected-twitter-user', user);
    this.router.navigate(['/gallery', username]);
  }
}
