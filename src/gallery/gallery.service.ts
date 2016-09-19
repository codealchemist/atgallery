import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GalleryService {
  config = {
    ip: 'twitter-server.herokuapp.com',
    port: 80,
    tweetsPerRequest: 70
  };

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

  getMediaTweets ({username, lastId}): Observable<[Object]> {
    let host = this.config.ip;
    let port = this.config.port;
    let count = this.config.tweetsPerRequest;

    let url = `http://${host}:${port}/tweets/${username}/media?count=${count}`
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

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
