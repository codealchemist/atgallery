import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StateService {
  @Output() onChange = new EventEmitter<any>();
  storage = {};

  setKey (key, value) {
    this.storage[key] = value;
    this.onChange.emit({key: key, value: value});
  }

  getKey (key) {
    return this.storage[key];
  }
}
