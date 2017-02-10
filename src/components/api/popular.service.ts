import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { ConfigService } from '../config/config.service'

@Injectable()
export class PopularApiService {
  private config = {
    apiUrl: 'http://localhost:5000/api'
  }

  constructor (
    private http: Http,
    private configService: ConfigService
  ) {
    this.config = this.configService.get('api')
  }

  countGallery (user) {
    let username = user.screen_name
    if (!username || !username.match(/^@?(\w){1,15}$/)) {
      throw new Error('ERROR: invalid Twitter username')
    }

    let apiUrl = this.config.apiUrl
    let url = `${apiUrl}/popular/count`
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let data = {
      username: username,
      name: user.name,
      description: user.description,
      background: user.profile_image_url.replace('_normal', '') // big image
    }

    console.log('COUNT POPULAR', url)
    return this.http
      .patch(url, data, headers)
      .timeout(3000, new Error(`countGallery: timeout exceeded for user ${username}`))
      .map((res: Response) => {
        let body = res.json()
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0])
        }
        return body
      })
      .catch(this.handleError)
  }

  getPopular () {
    let apiUrl = this.config.apiUrl
    let url = `${apiUrl}/popular`
    // let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http
      .get(url)
      .timeout(3000, new Error(`getPopular: timeout exceeded`))
      .map((res: Response) => {
        let body = res.json()
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0])
        }
        return body
      })
      .catch(this.handleError)
  }

  private handleError (error: any) {
    console.log('-- popular service error:', error)
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error'
    console.error(errMsg) // log to console instead
    return Observable.throw(errMsg)
  }
}
