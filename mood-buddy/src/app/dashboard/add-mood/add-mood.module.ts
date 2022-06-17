import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMoodPageRoutingModule } from './add-mood-routing.module';

import { AddMoodPage } from './add-mood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMoodPageRoutingModule
  ],
  declarations: [AddMoodPage]
})
export class AddMoodPageModule {}
