import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'atg-title',
    templateUrl: 'components/title/title.component.html',
})
export class TitleComponent implements OnInit {
  @Input() sectionName = '';

  ngOnInit () {

  }
}
