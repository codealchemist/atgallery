import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StateService {
  @Output() onChange = new EventEmitter<any>();
  storage = {}; // In memory storage.

  setKey (key, value, ttl?: number) {
    ttl = ttl || 60 * 60 * 1000; // 1 hour.
    this.storage[key] = value;
    localStorage.setItem(key, JSON.stringify({
      value,
      ttl,
      timestamp: (new Date()).getTime()
    }));
    this.onChange.emit({key, value});
  }

  getKey (key) {
    // Prefer in memory cache.
    if (this.storage[key]) return this.storage[key];

    // Try localStorage.
    const cached = JSON.parse(localStorage.getItem(key));
    if (!cached) return null;

    // Invalidate cache.
    const currentTimestamp = (new Date()).getTime();
    if (currentTimestamp - cached.timestamp > cached.ttl) {
      localStorage.removeItem(key);
      delete this.storage[key];
      return null;
    }

    // Set in memory cache and return cached value.
    this.storage[key] = cached.value;
    return cached.value;
  }
}
