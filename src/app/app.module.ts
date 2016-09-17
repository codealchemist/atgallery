import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { HomeComponent }  from '../home/home.component';
import { SearchComponent }  from '../search/search.component';
import { TitleComponent }  from '../title/title.component';
import { ShareComponent }  from '../share/share.component';
import { OurPicksComponent }  from '../our-picks/our-picks.component';
import { GalleryComponent }  from '../gallery/gallery.component';
import { StateService } from '../state/state.service';
import { routing } from './app.routing';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

@NgModule({
  imports: [ BrowserModule, FormsModule, routing, HttpModule, InfiniteScrollModule ],
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    TitleComponent,
    ShareComponent,
    OurPicksComponent,
    GalleryComponent
  ],
  providers: [
    StateService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
