import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OurPicksService } from './our-picks.service';
import { TwitterService } from '../twitter/twitter.service';
import { StateService } from '../state/state.service';
import { ConfigService } from '../config/config.service';

@Component({
    selector: 'atg-our-picks',
    templateUrl: 'components/our-picks/our-picks.component.html',
    styleUrls: [ 'components/our-picks/our-picks.component.css' ],
    providers: [ OurPicksService, TwitterService, ConfigService ]
})
export class OurPicksComponent implements OnInit {
  ourPicks = [];
  error = null;
  loading = true;

  constructor (
    private ourPicksService: OurPicksService,
    private stateService: StateService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.sanitizer = sanitizer
  }

  ngOnInit(): void {
    // retrieve and set cached picks (memory)
    let ourPicks = this.stateService.getKey('ourPicks');
    if (ourPicks) {
      this.ourPicks = ourPicks;
      this.loading = false;
      return;
    }

    // load picks from server
    this.getOurPicks();
  }

  selectGallery (user) {
    let username = user.screen_name;
    this.stateService.setKey('selected-twitter-user', user);
    this.router.navigate(['/gallery', username]);
  }

  getOurPicks () {
    let ourPicks = [];
    this.ourPicksService
      .getOurPicks()
      .subscribe(
        pick => {
          ourPicks.push(pick);
        },
        error => this.error = error,
        () => {
          this.stateService.setKey('ourPicks', ourPicks);
          this.ourPicks = ourPicks;
          this.loading = false;
        }
      );
  }

  getItemBackground (item) {
    var url = item.profile_image_url
    if (!url) return 'none'

    url = url.replace('_normal', '') // use bigger background
    var urlString = `url(${url})`
    return urlString
  }
}
