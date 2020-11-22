import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ExtAngularClassicModule } from '@sencha/ext-angular-classic';
import { AppComponent } from './app.component';
import { PivotComponent } from './pivot.component';

@NgModule({
  declarations: [
    AppComponent,
    PivotComponent
  ],
  imports: [
    BrowserModule,
    ExtAngularClassicModule
  ],
  providers: [],
  bootstrap: [PivotComponent]
})
export class AppModule { }