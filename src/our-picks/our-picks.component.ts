import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OurPicksService } from './our-picks.service';
import { TwitterService } from '../twitter/twitter.service';
import { StateService } from '../state/state.service';

@Component({
    selector: 'atg-our-picks',
    templateUrl: 'our-picks/our-picks.component.html',
    providers: [ OurPicksService, TwitterService ]
})
export class OurPicksComponent implements OnInit {
  ourPicks = [];
  error = null;

  constructor (
    private ourPicksService: OurPicksService,
    private stateService: StateService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.sanitizer = sanitizer
  }

  ngOnInit(): void {
    this.getOurPicks();
  }

  selectGallery (user) {
    let username = user.screen_name;
    this.stateService.setKey('selected-twitter-user', user);
    this.router.navigate(['/gallery', username]);
  }

  getOurPicks () {
    this.ourPicksService
      .getOurPicks()
      .subscribe(
        ourPicks => {
          this.ourPicks = ourPicks
        },
        error => this.error = error
      )
  }

  getItemBackground (item) {
    var url = item.profile_image_url
    if (!url) return 'none'

    url = url.replace('_normal', '') // use bigger background
    var urlString = `url(${url})`
    return urlString
  }
}
