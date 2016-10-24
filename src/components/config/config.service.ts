import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  private config = {}
  private configMap = {
    // development
    'localhost': {
      twitter: {
        host: 'http://localhost:3080',
        tweetsPerRequest: 10
      },
      api: {
        apiUrl: 'http://localhost:5000/api'
      }
    },

    // production
    'www.atgallery.me': {
      twitter: {
        host: 'https://twitter-server.herokuapp.com',
        tweetsPerRequest: 100
      },
      api: {
        apiUrl: 'https://www.atgallery.me/api'
      }
    }
  }

  constructor () {
    // set config aliases
    this.configMap['atgallery.herokuapp.com'] = this.configMap['www.atgallery.me'];

    let host = location.hostname;
    if (!this.configMap[host]) throw new Error(`ERROR: Host not defined in ConfigService: ${host}.`);

    this.config = this.configMap[host];
  }

  get (key) {
    if (!this.config[key]) throw new Error(`ERROR: Config key not available: ${key}`);
    return this.config[key];
  }
}
