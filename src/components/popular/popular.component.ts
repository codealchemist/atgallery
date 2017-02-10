import { Component, OnInit } from '@angular/core'
import { StateService } from '../state/state.service'
import { Router } from '@angular/router'
import { PopularApiService } from '../api/popular.service'
import { TwitterService } from '../twitter/twitter.service';
import { popularGalleriesMock } from './popular-galleries.mock'

@Component({
    selector: 'atg-popular',
    templateUrl: 'components/popular/popular.component.html',
    styleUrls: ['components/popular/popular.component.css'],
    providers: [ PopularApiService, TwitterService ]
})
export class PopularComponent implements OnInit {
  public popularItems = []

  constructor (
    private popularApiService: PopularApiService,
    private twitterService: TwitterService,
    private stateService: StateService,
    private router: Router
  ) { }

  ngOnInit () {
    this.popularApiService
      .getPopular()
      .subscribe(
        data => {
          // If there's no data available use mock.
          if (!data || data.length === 0) {
            this.popularItems = popularGalleriesMock
            return
          }

          data.map((item) => {
            this.twitterService
              .getUser(item.username)
              .subscribe((twitterUser) => {
                const viewObject = this.getViewObject(twitterUser, item)
                this.popularItems.push(viewObject)
              })
          })
        }
      )
  }

  getViewObject (twitterUser, popularItem) {
    return {
      "_id": popularItem._id,
      "background" : twitterUser.profile_image_url.replace('_normal', ''), // big image
      "count" : popularItem.count,
      "description" : twitterUser.description,
      "name" : twitterUser.name,
      "username" : popularItem.username
    }
  }

  selectGallery (item) {
    console.log('--- select gallery: item: ', item)
    let username = item.username;
    this.stateService.setKey('selected-twitter-user', item);
    this.router.navigate(['/gallery', username]);
  }
}
