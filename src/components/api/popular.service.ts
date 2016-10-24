import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class PopularApiService {
  private apiUrl = 'http://localhost:5000/api'

  constructor (private http: Http) {

  }

  countGallery (user) {
    // console.log('-- COUNT GALLERY:', user)
    let username = user.screen_name
    if (!username || !username.match(/^@?(\w){1,15}$/)) {
      throw new Error('ERROR: invalid Twitter username')
    }

    let url = `${this.apiUrl}/popular/count`
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let data = {
      username: username,
      name: user.name,
      description: user.description,
      background: user.profile_image_url.replace('_normal', '') // big image
    }

    return this.http
      .patch(url, data, headers)
      .timeout(3000, new Error(`countGallery: timeout exceeded for user ${username}`))
      .map((res: Response) => {
        let body = res.json()
        console.log(`--- patched | incremented count for username ${username}`, body)
        if (body.errors && body.errors.length) {
          return this.handleError(body.errors[0])
        }
        return body
      })
      .catch(this.handleError)
  }

  getPopular () {
    let url = `${this.apiUrl}/popular`
    // let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http
      .get(url)
      .timeout(3000, new Error(`getPopular: timeout exceeded`))
      .map((res: Response) => {
        let body = res.json()
        console.log('-- got popular galleries:', body)
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
