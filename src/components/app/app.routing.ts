import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OurPicksComponent } from '../our-picks/our-picks.component';
import { HomeComponent } from '../home/home.component';
import { GalleryComponent } from '../gallery/gallery.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'our-picks',
    component: OurPicksComponent
  },
  {
    path: 'gallery/:username',
    component: GalleryComponent
  },
  {
    path: 'gallery/search/:query',
    component: GalleryComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
