import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StateService {
  storage = {};

  setKey (key, value) {
    this.storage[key] = value;
    console.log(`-- set: ${key}`, this.storage);
  }

  getKey (key) {
    console.log(`-- get: ${key}`, this.storage);
    return this.storage[key];
  }
}
