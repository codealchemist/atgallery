import { Component, OnInit } from '@angular/core';
import { StateService } from '../state/state.service';

@Component({
    selector: 'atg-home',
    templateUrl: 'components/home/home.component.html'
})
export class HomeComponent implements OnInit {
  ngOnInit () {

  }

  constructor (private stateService: StateService) {
    stateService.setKey('homeOpened', null);
  }
}
