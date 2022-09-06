import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import {UpdatemoodComponent} from "../../components/updatemood/updatemood.component";
import {NgCalendarModule} from "ionic2-calendar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalPageRoutingModule,
    NgCalendarModule
  ],
  //ADD THE ENTRY COMPONENT AND THE DECLARATION
  entryComponents:[UpdatemoodComponent],
  declarations: [JournalPage, UpdatemoodComponent]
})
export class JournalPageModule {}
