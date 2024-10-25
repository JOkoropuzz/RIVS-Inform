import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { TableMultipleHeader } from './components/measure/measure.component';
import { TableService } from './servises/table.service';

import { MatMenuModule } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { JsonPipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    TableMultipleHeader,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule,
    JsonPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    NgbModule,
  ],
  providers: [
    TableService,
    provideNativeDateAdapter(),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
