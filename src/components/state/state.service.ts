import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StateService {
  @Output() onChange = new EventEmitter<any>();
  storage = {}; // In memory storage.

  setKey (key, value, ttl) {
    ttl = ttl || 60 * 60 * 1000; // 1 hour.
    this.storage[key] = value;
    localStorage.setItem(key, JSON.stringify({
      value,
      ttl,
      timestamp: (new Date()).getTime()
    }));
    this.onChange.emit({key: key, value: value});
  }

  getKey (key) {
    const cached = JSON.parse(localStorage.getItem(key));
    const currentTimestamp = (new Date()).getTime();

    // Invalidate cache.
    if (currentTimestamp - cached.timestamp > cached.ttl) {
      localStorage.removeItem(key);
      delete this.storage[key];
      return null;
    }

    return this.storage[key] || cached.value;
  }
}
