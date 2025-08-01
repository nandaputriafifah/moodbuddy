import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMoodPageRoutingModule } from './add-mood-routing.module';

import { AddMoodPage } from './add-mood.page';
import {NgCalendarModule} from "ionic2-calendar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMoodPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [AddMoodPage]
})
export class AddMoodPageModule {}
