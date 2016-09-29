import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TwitterService {
  config = {
    host: 'https://twitter-server.herokuapp.com',
    // host: 'http://localhost:3080',
    tweetsPerRequest: 70
  };

  constructor (private http: Http) {
    // this.loadConfig();
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

  getMediaTweets ({username, lastId, count}): Observable<[Object]> {
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

  getUser (username): Observable<Object> {
    var host = this.config.host;
    return this.http
      .get(`${host}/user/${username}`)
      .timeout(3000, new Error('timeout exceeded'))
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
