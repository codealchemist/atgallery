import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { HomeComponent }  from '../home/home.component';
import { SearchComponent }  from '../search/search.component';
import { PopularComponent }  from '../popular/popular.component';
import { TitleComponent }  from '../title/title.component';
import { ShareComponent }  from '../share/share.component';
import { OurPicksComponent }  from '../our-picks/our-picks.component';
import { GalleryComponent }  from '../gallery/gallery.component';
import { StateService } from '../state/state.service';
import { ConfigService } from '../config/config.service';
import { routing } from './app.routing';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { SeoService } from '../seo/seo.service';
import { CeiboShare } from 'ng2-social-share';

@NgModule({
  imports: [ BrowserModule, FormsModule, routing, HttpModule, InfiniteScrollModule ],
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    PopularComponent,
    TitleComponent,
    ShareComponent,
    OurPicksComponent,
    GalleryComponent,
    CeiboShare
  ],
  providers: [
    StateService,
    ConfigService,
    Title,
    SeoService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
