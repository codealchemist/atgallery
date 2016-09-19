import { Injectable } from '@angular/core';
import { OUR_PICKS } from './our-picks.mock';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OurPicksService {
  ourPicks = [];
  config = {
    ip: 'twitter-server.herokuapp.com',
    port: 80,
  };

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

  constructor (private http: Http) {
    this.loadConfig();
  }

  loadConfig (): any {
    this.http.get('../../twitter-server.json')
      .map(res => res.json())
      .subscribe(
        data => this.config = data,
        err => console.log(err),
        () => console.log('--- loaded config', this.config)
      );
  }

  getOurPicks (): Observable<[Object]> {
    var observables = this.usernames.map((username) => this.getTwitterUser(username));
    var source = Observable.combineLatest(observables);
    return source;
  }

  fillOurPicks (username) {
    this.getTwitterUser(username);
  }

  addPick (user) {
    this.ourPicks.push(user);
  }

  getTwitterUser (username): Observable<Object> {
    var host = this.config.ip;
    var port = this.config.port;
    return this.http
      .get(`https://${host}:${port}/user/${username}`)
      .map((res: Response) => {
        let body = res.json();
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0]);
        }
        return body;
      })
      .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
