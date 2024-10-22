import { Component, OnInit } from '@angular/core';
import { TableService } from '../../servises/table.service';
import { Product } from '../../models/products';
import * as data from '../../../../public/server-metrics.json';

/* Tutorial: https://www.javatpoint.com/display-data-from-json-file-in-angular */
interface JsonData { "read": number, "time": number, "used": number, "user": number, "wait": number, "cache": number, "write": number, "system": number, "buffers": number, "inbound": number, "outbound": number }



export interface DisplayColumn {
  def: string;
  label: string;
  hide: boolean;
}



@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  providers: [TableService],

})

export class TableMultipleHeader implements OnInit {

  allColumns: DisplayColumn[] = [
    { def: 'time', label: 'Время', hide: false },
    { def: 'TFcc', label: 'TFcc', hide: false },
    { def: 'el1', label: 'el1', hide: false },
    { def: 'el2', label: 'el2', hide: false },
    { def: 'el3', label: 'el3', hide: false },
    { def: 'el4', label: 'el4', hide: true },
    { def: 'el5', label: 'el5', hide: true },
    { def: 'el6', label: 'el6', hide: true },
    { def: 'el7', label: 'el7', hide: true },
    { def: 'el8', label: 'el8', hide: true }
  ];
  

  selectedProdName?: string;

  resultProducts: Product[]=[];

  //string array of columns name
  displayedColumns?: string[];

  constructor(private tableServ: TableService) { }


  ngOnInit(): void {
    this.selectedProdName = this.tableServ.productNameSelector()[0];
    this.fillColumns();
    this.hideColumns();
    this.resultProducts = this.tableServ.productSelector(this.selectedProdName);

    for (var i = 0; i < this.jsonData.length; i++) {
      this.systemDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].system) });
      this.userDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].user) });
      this.waitDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].wait) });
      this.buffersDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].buffers) });
      this.cacheDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].cache) });
      this.usedDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].used) });
      this.inboundDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].inbound) });
      this.outboundDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].outbound) });
      this.writeDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].write) });
      this.readDps.push({ x: Number(this.jsonData[i].time), y: Number(this.jsonData[i].read) });
    }
  }

  //string array of products name
  prodNames = this.tableServ.productNameSelector();

  //fill columns data
  fillColumns() {
    const elems = this.tableServ.getProductElements(this.selectedProdName!);
    for (let i = 1; i < 9; i++) {
      if (elems[i - 1] != null && elems[i - 1] != undefined && elems[i - 1] != '') {
        this.allColumns.find(col => col.def === 'el' + i)!.label = elems[i - 1];
        this.allColumns.find(col => col.def === 'el' + i)!.hide = false;
      }
      else {
        this.allColumns.find(col => col.def === 'el' + i)!.hide = true;
      }
    }
  }

  //change selected product
  select(value: string) {
    this.selectedProdName = value;
    this.fillColumns();
    this.hideColumns();
    this.resultProducts = this.tableServ.productSelector(this.selectedProdName);
  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

  dps1: any = []; dps2: any = []; dps3: any = []; charts: any = [];

  toolTip = {
    shared: true
  };
  legend = {
    cursor: "pointer",
    itemclick: function (e: any) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
  };

  systemDps: any = []; userDps: any = []; waitDps: any = []; buffersDps: any = []; cacheDps: any = []; usedDps: any = []; inboundDps: any = []; outboundDps: any = []; writeDps: any = []; readDps: any = [];
  onToolTipUpdated: any; onToolTipHidden: any; onCrosshairUpdated: any; onCrosshairHidden: any; onRangeChanged: any;

  cpuChartOptions = {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title: {
      text: "CPU Utilization"
    },
    toolTip: this.toolTip,
    axisY: {
      valueFormatString: "#0.#%",
    },
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: "User",
      yValueFormatString: "#0.#%",
      color: "#64b5f6",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.userDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "System",
      yValueFormatString: "#0.#%",
      color: "#2196f3",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.systemDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "Wait",
      yValueFormatString: "#0.#%",
      color: "#1976d2",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.waitDps
    }]
  };
  memoryChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Memory Usage"
    },
    axisY: {
      suffix: " GB"
    },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: "Cache",
      color: "#e57373",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## GB",
      legendMarkerType: "square",
      dataPoints: this.cacheDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "Buffers",
      color: "#f44336",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## GB",
      legendMarkerType: "square",
      dataPoints: this.buffersDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "Used",
      color: "#d32f2f",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## GB",
      legendMarkerType: "square",
      dataPoints: this.usedDps
    }]
  }
  networkChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Network Traffic"
    },
    axisY: {
      suffix: " Kb/s"
    },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: "Outbound",
      color: "#81c784",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## Kb/s",
      legendMarkerType: "square",
      dataPoints: this.outboundDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "Inbound",
      color: "#388e3c",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## Kb/s",
      legendMarkerType: "square",
      dataPoints: this.inboundDps
    }]
  }
  diskChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Disk I/O (IOPS)"
    },
    axisY: {},
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: "Write",
      color: "#ffb74d",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## ops/second",
      legendMarkerType: "square",
      dataPoints: this.writeDps
    }, {
      type: "splineArea",
      showInLegend: "true",
      name: "Read",
      color: "#f57c00",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      yValueFormatString: "#.## ops/second",
      legendMarkerType: "square",
      dataPoints: this.readDps
    }]
  }

  getChartInstance = (chart: any) => {
    this.charts.push(chart);
  }

  jsonData: JsonData[] = (data as any).default;

  ngAfterViewInit() {
    this.syncCharts(this.charts, true, true, true);
  }

  syncCharts = (charts: any, syncToolTip: any, syncCrosshair: any, syncAxisXRange: any) => {
    if (!this.onToolTipUpdated) {
      this.onToolTipUpdated = function (e: any) {
        for (var j = 0; j < charts.length; j++) {
          if (charts[j] != e.chart)
            charts[j].toolTip.showAtX(e.entries[0].xValue);
        }
      }
    }

    if (!this.onToolTipHidden) {
      this.onToolTipHidden = function (e: any) {
        for (var j = 0; j < charts.length; j++) {
          if (charts[j] != e.chart)
            charts[j].toolTip.hide();
        }
      }
    }

    if (!this.onCrosshairUpdated) {
      this.onCrosshairUpdated = function (e: any) {
        for (var j = 0; j < charts.length; j++) {
          if (charts[j] != e.chart)
            charts[j].axisX[0].crosshair.showAt(e.value);
        }
      }
    }

    if (!this.onCrosshairHidden) {
      this.onCrosshairHidden = function (e: any) {
        for (var j = 0; j < charts.length; j++) {
          if (charts[j] != e.chart)
            charts[j].axisX[0].crosshair.hide();
        }
      }
    }

    if (!this.onRangeChanged) {
      this.onRangeChanged = function (e: any) {
        for (var j = 0; j < charts.length; j++) {
          if (e.trigger === "reset") {
            charts[j].options.axisX.viewportMinimum = charts[j].options.axisX.viewportMaximum = null;
            charts[j].options.axisY.viewportMinimum = charts[j].options.axisY.viewportMaximum = null;
            charts[j].render();
          } else if (charts[j] !== e.chart) {
            charts[j].options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
            charts[j].options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;
            charts[j].render();
          }
        }
      }
    }

    for (var i = 0; i < charts.length; i++) {

      //Sync ToolTip
      if (syncToolTip) {
        if (!charts[i].options.toolTip)
          charts[i].options.toolTip = {};

        charts[i].options.toolTip.updated = this.onToolTipUpdated;
        charts[i].options.toolTip.hidden = this.onToolTipHidden;
      }

      //Sync Crosshair
      if (syncCrosshair) {
        if (!charts[i].options.axisX)
          charts[i].options.axisX = { labelAngle: 0, crosshair: { enabled: true, snapToDataPoint: true, valueFormatString: "HH:mm" } };

        charts[i].options.axisX.crosshair.updated = this.onCrosshairUpdated;
        charts[i].options.axisX.crosshair.hidden = this.onCrosshairHidden;
      }

      //Sync Zoom / Pan
      if (syncAxisXRange) {
        charts[i].options.zoomEnabled = true;
        charts[i].options.rangeChanged = this.onRangeChanged;
      }

      charts[i].render();
    }
  }
}
