import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GalleryService } from './gallery.service';
import { StateService } from '../state/state.service';
import { InfiniteScroll } from 'angular2-infinite-scroll';

@Component({
    selector: 'atg-gallery',
    templateUrl: 'gallery/gallery.component.html',
    styleUrls: ['gallery/gallery.component.css'],
    providers: [ GalleryService ]
})
export class GalleryComponent implements OnInit {
  @Output() galleryOpened = new EventEmitter();
  username = null;
  name = null;
  tweets = [];
  loading = true;
  lastId = null;
  hasMore = true;
  tweetsPerRequest = 70;
  totalWhileRecursing = 0;
  gallery;

  constructor (
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private stateService: StateService
  ) { }

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      console.log('-- username:', this.username);

      // let user = this.stateService.getKey('selected-twitter-user');
      // console.log('-- USER:', user);
      // if (user) this.name = user.name;
      this.load(this.lastId);
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
        this.gallery = jQuery("#lightgallery").lightGallery();
      }
    }, 100);
  }

  load (lastId) {
    let params = {
      username: this.username,
      lastId: lastId
    };

    this.loading = true;
    this.galleryService
      .getMediaTweets(params)
      .subscribe(
        tweets => this.loaded(tweets),
        error => this.handleError(error)
      );
  }

  private loaded (tweets) {
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
      this.load(this.lastId);
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
    // console.log('-- set name from tweets');
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
    if (this.loading) {
      console.log('--- LOADING in progress! Wait until it finishes to load more')
      return;
    }

    if (!this.hasMore) {
      // TODO
      console.log('--- no more tweets for user, disable infite scroll...');
      return;
    }

    console.log('-- on scroll');
    this.load(this.lastId);
  }
}
