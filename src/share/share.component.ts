import { Component } from '@angular/core';
import { ShareService } from './share.service';

@Component({
    selector: 'atg-share',
    templateUrl: 'share/share.component.html',
})
export class ShareComponent {
  constructor () {
    // use global method to initialize social sharing buttons
    initSharing();
  }
}
