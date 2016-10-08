import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TwitterService {
  config = {
    host: 'https://twitter-server.herokuapp.com',
    // host: 'http://localhost:3080',
    tweetsPerRequest: 100
  };

  constructor (private http: Http, private configService: ConfigService) {
    // this.loadConfig();
    this.config = this.configService.get('twitter');
  }

  // loadConfig (): any {
  //   this.http.get('../../twitter-server.json')
  //     .map(res => res.json())
  //     .subscribe(
  //       data => this.config = data,
  //       err => console.log(err),
  //       () => console.log('--- loaded config', this.config)
  //     );
  // }

  getUserMediaTweets ({username, lastId, count}): Observable<[Object]> {
    let host = this.config.host;
    count = count || this.config.tweetsPerRequest;

    let url = `${host}/tweets/${username}/media?count=${count}`
    if (lastId) url+=`&max_id=${lastId}`;

    return this.http
      .get(url)
      .map((res: Response) => {
        let body = res.json();
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0]);
        }
        return body;
      })
      .catch(this.handleError);
  }

  getSearchMediaTweets ({query, lastId, count}): Observable<[Object]> {
    let host = this.config.host;
    count = count || this.config.tweetsPerRequest;
    query = encodeURIComponent(query);

    let url = `${host}/search/${query}/media?count=${count}`
    console.log('--- service url:', url);
    if (lastId) url+=`&max_id=${lastId}`;

    return this.http
      .get(url)
      .map((res: Response) => {
        let body = res.json();
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0]);
        }
        return body;
      })
      .catch(this.handleError);
  }

  getUser (username) {
    var host = this.config.host;
    return this.http
      .get(`${host}/user/${username}`)
      .timeout(3000, new Error(`timeout exceeded for user ${username}`))
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
    console.log('-- twitter service error:', error);
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
