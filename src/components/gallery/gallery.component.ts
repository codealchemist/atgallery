import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TwitterService } from '../twitter/twitter.service';
import { StateService } from '../state/state.service';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { SeoService } from '../seo/seo.service';

@Component({
    selector: 'atg-gallery',
    templateUrl: 'components/gallery/gallery.component.html',
    styleUrls: ['components/gallery/gallery.component.css'],
    providers: [ TwitterService ]
})
export class GalleryComponent implements OnInit {
  @Output() galleryOpened = new EventEmitter();
  username = null;
  user = null;
  name = null;
  tweets = [];
  loading = true;
  lastId = null;
  hasMore = true;
  tweetsPerRequest = 100;
  totalWhileRecursing = 0;
  gallery;

  constructor (
    private route: ActivatedRoute,
    private twitterService: TwitterService,
    private stateService: StateService,
    private seoService: SeoService
  ) { }

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.load();

      this.seoService.setOpenGraphMeta('title', `${this.username} - Automatic Twitter Gallery`);
      this.seoService.setOpenGraphMeta('url', location.href);
    });
  }

  initGallery (totalTweets) {
    // console.log('-- init gallery attempt');

    // TODO: find a better way!
    // subscribe to an angular event informing the ui finished rendering? how?!
    setTimeout(() => {
      let renderedTweets = jQuery('#lightgallery').find('a').length;
      if (renderedTweets < totalTweets) return this.initGallery(totalTweets);

      // ok, all rendered, init
      // console.log('-- init gallery OK!');
      if (this.gallery) {
        this.gallery.data('lightGallery').refresh();
      } else {
        this.gallery = jQuery("#lightgallery").lightGallery({
          selector: 'a'
        });
      }
    }, 100);
  }

  loadTweets (lastId) {
    this.loading = true;
    let params = {
      username: this.username,
      lastId: lastId,
      count: this.tweetsPerRequest
    };

    this.twitterService
      .getMediaTweets(params)
      .subscribe(
        tweets => this.tweetsLoaded(tweets),
        error => this.handleError(error)
      );
  }

  loadUser () {
    this.twitterService
      .getUser(this.username)
      .subscribe(
        user => this.userLoaded(user),
        error => this.handleError
      );
  }

  load () {
    this.loadUser();
    this.loadTweets(null);
  }

  private userLoaded(user) {
    this.user = user;
    this.stateService.setKey('galleryOpened', user);

    // set open graph metas
    this.seoService.setOpenGraphMeta('image', user.profile_image_url.replace('_normal', ''));
    this.seoService.setOpenGraphMeta('description', `${user.description} (source: @atgallery)`);
  }

  private tweetsLoaded (tweets) {
    let partial = tweets.length;
    if (!partial) {
      // no more tweets!
      // console.log(`--- no more tweets for user ${this.username}`);
      this.loading = false;
      this.hasMore = false;

      // show a name for user without tweets
      if (!this.name) this.setName(tweets);
      return;
    }

    this.setLastId(tweets);
    this.addTweets(tweets);
    if (!this.name) this.setName(tweets);

    // recurse to get enough
    this.totalWhileRecursing+=partial;
    if (this.totalWhileRecursing < this.tweetsPerRequest) {
      this.setLastId(tweets);
      this.loadTweets(this.lastId);
      return;
    }

    this.totalWhileRecursing = 0;
    this.loading = false;
  }

  setLastId (tweets) {
    if (!tweets.length) {
      this.hasMore = false;
      return;
    }

    var lastTweet = tweets.slice(-1)[0];
    this.lastId = lastTweet.id;
  }

  addTweets (tweets) {
    this.tweets = this.tweets.concat(tweets);
    this.initGallery(this.tweets.length);
  }

  setName (tweets) {
    if (!tweets.length) {
      this.name = this.username
      return;
    }

    this.name = tweets[0].user.name;
  }

  handleError (error) {
    console.log('--- ERROR:', error);
  }

  onScroll () {
    if (this.loading) return;

    // TODO: unbind onScroll
    if (!this.hasMore) return;

    this.loadTweets(this.lastId);
  }

  openTweet (tweetUrl) {
    window.open('http://' + tweetUrl);
  }
}
