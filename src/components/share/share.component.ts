import { Component, OnInit } from '@angular/core';
import { StateService } from '../state/state.service';

@Component({
  selector: 'atg-share',
  templateUrl: 'components/share/share.component.html',
  styleUrls: [ 'components/share/share.component.css' ]
})
export class ShareComponent implements OnInit {
  url = '';
  text = '';

  constructor (private stateService: StateService) {

  }

  ngOnInit () {
    // use global method to initialize social sharing buttons
    initSharing();

    this.url = location.href;
    this.text = 'I just found amazing #photo galleries, check them out!';

    this.stateService.onChange.subscribe(
      change => this.onStateChange(change)
    );
  }

  private onStateChange (change) {
    if (change.key === 'galleryOpened') {
      this.url = location.href;
      this.text = `Check out this amazing #photo gallery!`;
    }

    if (change.key === 'homeOpened') {
      this.url = location.href;
      this.text = `I just found amazing #photo galleries, check them out!`;
    }
  }
}
