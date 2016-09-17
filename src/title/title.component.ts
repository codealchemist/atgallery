import { Component, Input } from '@angular/core';

@Component({
    selector: 'atg-title',
    templateUrl: 'title/title.component.html',
})
export class TitleComponent {
  @Input() sectionName = '';
}
