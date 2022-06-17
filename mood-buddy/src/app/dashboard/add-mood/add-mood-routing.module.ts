import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMoodPage } from './add-mood.page';

const routes: Routes = [
  {
    path: '',
    component: AddMoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMoodPageRoutingModule {}
