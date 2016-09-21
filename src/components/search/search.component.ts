import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'atg-search',
    templateUrl: 'components/search/search.component.html',
    styleUrls: [ 'components/search/search.component.css' ]
})
export class SearchComponent {
  username = null;

  constructor (private router: Router) {

  }

  viewGallery () {
    this.router.navigate(['/gallery', this.username]);
  }

  searchOnEnter (keyCode) {
    if (keyCode === 13) this.viewGallery();
  }
}
