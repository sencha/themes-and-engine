

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<ExtPanel
  viewport="true"
  title="panel"
  layout="vbox"
  (ready)="viewReady($event)"
  bodyStyle="background:#ffc;"
>
  <ExtToolbar width="100%" [layout]='{ "type":"hbox" }'>
    <ExtButton text="get DateTime" border="1" (click)=this.getNow($event)></ExtButton>
    <ExtContainer extname="div" html="div"></ExtContainer>
    <ExtButton text="get DateTime Also" border="1" [handler]=this.getNow></ExtButton>
  </ExtToolbar>
  <ExtGrid
    margin="10px"
    shadow="true"
    width="100%"
    flex="1"
    [title]="title"
    extname="grid"
    [columns]='[
      { "text":"name", "dataIndex":"name" },
      { "text":"email", "dataIndex":"email", "flex": "1" }
    ]'
  >
  </ExtGrid>
</ExtPanel>
  `,
  styles: []
})
export class AppComponent {
  //(columns)="columns"
  // columns=[
  //   {text:'name', dataIndex:'name'},
  //   {text:'email', dataIndex:'email', flex: 1}
  // ]
  // <ExtGridcolumn text="name" dataIndex="name"></ExtGridcolumn>
  // <ExtGridcolumn text="email" dataIndex="email" flex="1"></ExtGridcolumn>

  title = 'the grid';
  store = {
    xtype: 'store',
    data: [
      { name: 'Marc', email: 'marc@gmail.com' },
      { name: 'Nick', email: 'nick@gmail.com' },
      { name: 'Andy', email: 'andy@gmail.com' },
    ]
  }

  getNow = (event) => {
    this['div'].setHtml(new Date())
  }

  viewReady(event) {
    for (var prop in event.cmpObj) {
      this[prop] = event.cmpObj[prop];
    }

    this['div'].setHtml('initial html')
    this['grid'].setStore(this.store)
  }
}