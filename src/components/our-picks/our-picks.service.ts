import { Injectable } from '@angular/core';
import { OUR_PICKS } from './our-picks.mock';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TwitterService } from '../twitter/twitter.service';

@Injectable()
export class OurPicksService {
  ourPicks = [];
  twitterService;

  // the service will query the following usernames on twitter
  // to get the latest data for them ('username', 'logo', description)
  usernames = [
    'mindworld28',
    'BeautifulBzarre',
    'NHampshireNana',
    'BEAUTIFULPlCS',
    'EarthPix',
    'Piclogy',
    'Tripfania',
    'NASA',
    'NASAhistory',
    'B_Ubiquitous',
    'NeatPhotos',
    'Historicalmages',
    'HistoryInPix',
    'fabulousanimals',
    'Marialovessea',
    'AMAZlNGMoment',
    'kritayuga',
    'estella_one',
    'MyBeachStore',
    'stockbundles',
    'TheEconomist',
    'NHM_WPY',
    'FilmsnotDead',
    'Giulio43884005',
    'HUCKmagazine',
    'hacerfotos',
    'MuseumModernArt',
    'adventuresvibes',
    'NissanUSA',
    'MagnumPhotos',
    'SURFER_Magazine',
    'WorldPressPhoto',
    'Australia',
    'usairforce',
    'SuperGeekGirls',
    'Dodge',
    'Canada',
    'Strange_Animals',
    'archpics',
    'Crystal_Fishy',
    'Audi',
    'lLoveHistory',
    'RayanDkhilFLY',
    'sweetrhythms',
    'duneprints',
    'icelevmagazine',
    'todgecrain',
    'iStock',
    'ZaibatsuPlanet',
    'Telanova_',
    'HuffingtonPost',
    'travelinglens',
    'premierleague',
    'wsl'
  ];

  constructor (private http: Http, twitterService: TwitterService) {
      // if not done this way the compiler throws:
      // Type 'Observable<Object>' is not assignable to type '[Object]'.
      this.twitterService = twitterService;
  }

  getOurPicks (): Observable<[Object]> {
    var observables = this.usernames.map((username) => this.twitterService.getUser(username));
    return Observable.onErrorResumeNext(observables);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
