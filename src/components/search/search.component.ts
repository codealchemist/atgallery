import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'atg-search',
    templateUrl: 'components/search/search.component.html',
    styleUrls: [ 'components/search/search.component.css' ]
})
export class SearchComponent implements OnInit {
  public query = null;
  public placeholder = ''
  @Input() type = 'user' // default type
  private url = '/gallery' // default search url
  private types = {
    user: {
      placeholder: 'twitter account username',
      url: '/gallery'
    },
    search: {
      placeholder: 'search terms',
      url: '/gallery/search'
    }
  }

  constructor (private router: Router) {

  }

  ngOnInit() {
    // set placeholder and search url for current type
    if (!this.type in this.types) throw new Error('ERROR: Search type not defined in SearchComponent.types.')
    let searchType = this.types[this.type]
    this.placeholder = searchType.placeholder
    this.url = searchType.url
  }

  viewGallery () {
    this.router.navigate([this.url, this.query]);
  }

  searchOnEnter (keyCode) {
    if (keyCode === 13) this.viewGallery();
  }
}
