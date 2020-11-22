import { Component } from '@angular/core';
import { generateData } from './generateSaleData';
import { model } from './SaleModel';
declare var Ext: any;

@Component({
  selector: 'app-root',
  template: `
<ExtContainer viewport="true" layout="fit">
  <ExtPivotgrid
    [startRowGroupsCollapsed]="false"
    [startColGroupsCollapsed]="false"
    [matrix]="pivotgridMatrix"
  ></ExtPivotgrid>
</ExtContainer>
  `,
  styles: []
})

export class PivotComponent {

  store: any = Ext.create('Ext.data.Store', {
    model: model,
    data: generateData()
  });

  pivotgridMatrix = {
    type: 'local',
    store: this.store,
    viewLayoutType: 'outline',
    aggregate: [{
        dataIndex: 'value',
        header: 'Total',
        aggregator: 'sum',
        width: 110
    }],
    leftAxis: [{
        dataIndex: 'person',
        header: 'Person',
        width: 150
    }, {
        dataIndex: 'company',
        header: 'Company',
        sortable: false,
        width: 150
    }, {
        dataIndex: 'country',
        header: 'Country',
        width: 150
    }],
    topAxis: [{
        dataIndex: 'year',
        header: 'Year'
    }]
  };

}