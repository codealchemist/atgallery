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
  query = null;
  user = null;
  name = null;
  sectionName = '';
  tweets = [];
  loading = true;
  lastId = null;
  hasMore = true;
  tweetsPerRequest = 100;
  totalWhileRecursing = 0;
  gallery;
  endMessage = 'No more tweets available.';
  tweetIds = [];

  constructor (
    private route: ActivatedRoute,
    private twitterService: TwitterService,
    private stateService: StateService,
    private seoService: SeoService
  ) { }

  ngOnInit () {
    this.route.params.subscribe(params => {
      // username OR query will have a value
      // gallery supports two basic search types:
      // - by username: gets media tweets for a specific user
      // - by query: allows to search by hashtags or strings
      this.username = params['username'];
      this.query = params['query'];
      this.load(); // will do the correct search type: user|query

      let title = this.username || 'Search';
      this.seoService.setOpenGraphMeta('title', `${title} - Automatic Twitter Gallery`);
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

  loadUserTweets (lastId) {
    this.loading = true;
    let params = {
      username: this.username,
      lastId: lastId,
      count: this.tweetsPerRequest
    };

    this.twitterService
      .getUserMediaTweets(params)
      .subscribe(
        tweets => this.userTweetsLoaded(tweets),
        error => this.handleError(error)
      );
  }

  loadSearchTweets (lastId) {
    this.loading = true;
    let params = {
      query: this.query,
      lastId: lastId,
      count: this.tweetsPerRequest
    };

    this.twitterService
      .getSearchMediaTweets(params)
      .subscribe(
        response => this.searchTweetsLoaded(response),
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
    // user type search: gets media tweets for a specific user
    if (this.username) {
      this.endMessage = `Well done! You retrieved all available media for user <b>${this.username}</b>.`;

      this.loadUser();
      this.loadUserTweets(null);
      return;
    }

    // query type search: gets medis tweets for used query terms
    this.endMessage = `Well done! You retrieved all available media for your search.`;
    this.loadSearchTweets(null);
    this.sectionName = this.query;
  }

  private userLoaded(user) {
    this.user = user;
    this.stateService.setKey('galleryOpened', user);
    this.sectionName = user.name;

    // set open graph metas
    this.seoService.setOpenGraphMeta('image', user.profile_image_url.replace('_normal', ''));
    this.seoService.setOpenGraphMeta('description', `${user.description} (source: @atgallery)`);
  }

  private userTweetsLoaded (tweets) {
    // console.log('---- GOT TWEETS', tweets)
    let partial = tweets.length;
    if (!partial) {
      // no more tweets!
      // console.log(`--- no more tweets for user ${this.username}`);
      this.loading = false;
      this.hasMore = false;

      // show a name for user without tweets
      if (this.username && !this.name) this.setName(tweets);
      return;
    }

    this.setLastId(tweets);
    this.addTweets(tweets);
    if (this.username && !this.name) this.setName(tweets);

    // recurse to get enough
    this.totalWhileRecursing+=partial;
    if (this.totalWhileRecursing < this.tweetsPerRequest) {
      this.setLastId(tweets);
      this.loadUserTweets(this.lastId);
      return;
    }

    this.totalWhileRecursing = 0;
    this.loading = false;
  }

  private searchTweetsLoaded ({statuses, search_metadata}) {
    let partial = statuses.length;
    if (!partial) {
      // no more tweets!
      // console.log(`--- no more tweets for query ${this.query}`);
      this.loading = false;
      this.hasMore = false;
      return;
    }

    let addedCount = this.addTweets(statuses);
    if (!search_metadata.next_results) {
      // console.log(`--- no more tweets for query ${this.query}`);
      this.loading = false;
      this.hasMore = false;
      return;
    }
    this.setLastIdFromMetadata(search_metadata);

    // recurse to get enough
    this.totalWhileRecursing+=addedCount;
    if (this.totalWhileRecursing < this.tweetsPerRequest) {
      this.setLastIdFromMetadata(search_metadata);
      this.loadSearchTweets(this.lastId);
      return;
    }

    this.totalWhileRecursing = 0;
    this.loading = false;
  }

  setLastIdFromMetadata(metadata) {
    let nextParams = metadata.next_results;
    let maxId = nextParams.match(/max_id=(.*?)&/)[1];
    // let maxId = metadata.max_id_str;
    this.lastId = maxId;
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
    tweets = this.addMediaTweets(tweets);

    this.tweets = this.tweets.concat(tweets);
    this.initGallery(this.tweets.length);
    return tweets.length;
  }

  getHash (str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  addMediaTweets(tweets) {
    let extendedTweets = tweets.map((tweet) => {
      tweet.media = this.getMediaTweet(tweet);
      return tweet;
    })

    extendedTweets = extendedTweets.filter((tweet) => tweet.media);
    return extendedTweets;
  }

  setName (tweets) {
    if (!tweets.length) {
      this.name = this.username;
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

    // user gallery
    if (this.username) {
      this.loadUserTweets(this.lastId);
      return;
    }

    // search gallery
    this.loadSearchTweets(this.lastId);
  }

  openTweet (tweetUrl, event) {
    window.open('http://' + tweetUrl);
    event.stopPropagation();
    event.preventDefault();
  }

  // TODO: document and find a better way
  getMediaTweet(tweet) {
    // console.log('---- tweet', tweet);
    let mediaTweet = null;

    // if first char is a dot it breaks lightgallery!
    if (tweet.text[0] === '.') tweet.text = tweet.text.slice(1);
    if (tweet.text[0] === '#') tweet.text = '&num;' + tweet.text.slice(1);

    // tweet with media
    if (
      tweet.extended_entities &&
      tweet.extended_entities.media &&
      tweet.extended_entities.media[0]
    ) {
      mediaTweet = tweet.extended_entities.media[0];
    }
    if (
      tweet.entities &&
      tweet.entities.media &&
      tweet.entities.media[0]
    ) {
      mediaTweet = tweet.entities.media[0];
    }

    // reply with media
    if (
      tweet.retweeted_status &&
      tweet.retweeted_status.entities &&
      tweet.retweeted_status.entities.media &&
      tweet.retweeted_status.entities.media[0]
    ) {
      mediaTweet = tweet.retweeted_status.entities.media[0];
    }
    if (
      tweet.retweeted_status &&
      tweet.retweeted_status.extended_entities &&
      tweet.retweeted_status.extended_entities.media &&
      tweet.retweeted_status.extended_entities.media[0]
    ) {
      mediaTweet = tweet.retweeted_status.extended_entities.media[0];
    }

    // handle error
    // console.log('--- mediaTweet:', mediaTweet)
    // if (!mediaTweet) throw new Error('ERROR: Tweet was expected to contain media!');

    return mediaTweet;
  }
}
