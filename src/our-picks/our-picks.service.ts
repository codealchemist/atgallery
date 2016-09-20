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
    'kritayuga',
    'LamborghiniRD',
    'AfremovArt',
    'estella_one',
    'Marialovessea',
    'NASA',
    'MyBeachStore',
    'stockbundles',
    'Tripfania',
    'BestEarthPix',
    'TheEconomist',
    'Historicalmages',
    'HistoryInPix',
    'fabulousanimals',
    'SPACEdotcom',
    'NHM_WPY',
    'FilmsnotDead',
    'Piclogy',
    'Giulio43884005',
    'HUCKmagazine',
    'hacerfotos',
    'MuseumModernArt',
    'adventuresvibes',
    'NissanUSA',
    'MagnumPhotos',
    'SURFER_Magazine',
    'EarthPix',
    'WorldPressPhoto',
    'BEAUTIFULPlCS',
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
    'rainer0107',
    'ruizstanley5',
    'AMAZlNGMoment',
    'RayanDkhilFLY',
    'sweetrhythms',
    'duneprints',
    'pwalburgh84',
    'icelevmagazine',
    'todgecrain',
    'NeatPhotos',
    'iStock',
    'ZaibatsuPlanet',
    'Telanova_',
    'HuffingtonPost',
    'ClariceByGuestU',
    'travelinglens',
    'premierleague',
    'wsl'
  ];

  constructor (private http: Http, twitterService: TwitterService) {
    this.twitterService = twitterService;
  }

  getOurPicks (): Observable<[Object]> {
    var observables = this.usernames.map((username) => this.twitterService.getUser(username));
    var source = Observable.combineLatest(observables);
    return source;
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
