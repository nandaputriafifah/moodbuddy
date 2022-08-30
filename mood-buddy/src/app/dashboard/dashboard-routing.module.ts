import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/tabs/landing-page',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: DashboardPage,
    children: [
      {
        path: 'landing-page',
        loadChildren: () => import('./landing-page/landing-page.module').then( m => m.LandingPagePageModule)
      },
      {
        path: 'journal',
        loadChildren: () => import('./journal/journal.module').then( m => m.JournalPageModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
    ]
  },
  {
    path: 'add-mood',
    loadChildren: () => import('./add-mood/add-mood.module').then( m => m.AddMoodPageModule)
  },  {
    path: 'statistic',
    loadChildren: () => import('./statistic/statistic.module').then( m => m.StatisticPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
