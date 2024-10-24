import { Component, OnInit } from '@angular/core';
import { TableService } from '../../servises/table.service';
import { Measure } from '../../models/measure';

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
  
  //string array of products name
  prodNames = this.tableServ.productNameSelector();

  selectedProdName?: string;

  productMeasures: Measure[]=[];

  //string array of columns name
  displayedColumns?: string[];

  //CanvasJS
  charts: any = [];
  
  constructor(private tableServ: TableService) {}


  ngOnInit(): void {
    this.selectedProdName = this.tableServ.productNameSelector()[0];
    this.fillColumns();
    this.hideColumns();
    this.productMeasures = this.tableServ.productSelector(this.selectedProdName);
    this.fillCharts();
    //CanvasJS
    
  }
  //fill charts data
  fillCharts() {
    while (this.TFccDps.length != 0) {
      this.TFccDps.shift();
      this.el1Dps.shift();
      this.el2Dps.shift();
      this.el3Dps.shift();
      this.el4Dps.shift();
      this.el5Dps.shift();
      this.el6Dps.shift();
      this.el7Dps.shift();
      this.el8Dps.shift();
    }

    for (var i = 0; i < this.productMeasures.length; i++) {
      this.TFccDps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].TFcc) };
      this.el1Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el1) };
      this.el2Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el2) };
      this.el3Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el3) };
      this.el4Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el4) };
      this.el5Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el5) };
      this.el6Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el6) };
      this.el7Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el7) };
      this.el8Dps[i] = { x: Number(Math.round(this.productMeasures[i].time.getTime())), y: Number(this.productMeasures[i].el8) };
    }
  }

  //show(hide) charts
  toggleDivsVisibility() {
    var divsOfCharts = [
      document.getElementById('TFcc')!,
      document.getElementById('el1')!,
      document.getElementById('el2')!,
      document.getElementById('el3')!,
      document.getElementById('el4')!,
      document.getElementById('el5')!,
      document.getElementById('el6')!,
      document.getElementById('el7')!,
      document.getElementById('el8')!,
    ];

    divsOfCharts.forEach((el) => {
      if (this.allColumns.find(col => col.def === el.id)!.hide) {
        el.style.display = 'none';
      }
      else {
        el.style.display = 'block';
      }
    } )
  }

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
    this.productMeasures = this.tableServ.productSelector(this.selectedProdName);
    this.toggleDivsVisibility();
    this.fillCharts();
    this.renderCharts();
  }

  //render charts
  renderCharts() {
    var credits = document.getElementsByClassName('canvasjs-chart-credit') as HTMLCollectionOf<HTMLElement>;
    Array.from(credits).forEach(element => 
      element.style.display = 'none'
    );
    for (var j = 0; j < this.charts.length; j++) {
      if (this.allColumns[j + 1].hide == false)
        this.charts[j].options.title.text = this.allColumns[j + 1].label;
        this.charts[j].render();
    }
  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }


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

  TFccDps: any = []; el1Dps: any = []; el2Dps: any = []; el3Dps: any = [];
  el4Dps: any = []; el5Dps: any = []; el6Dps: any = []; el7Dps: any = [];
  el8Dps: any = []; onToolTipUpdated: any; onToolTipHidden: any;
  onCrosshairUpdated: any; onCrosshairHidden: any; onRangeChanged: any;

  TFccOptions = {
    animationEnabled: true,
    theme: "ligth2", // "light1", "light2", "dark1", "dark2"
    title: {
      text: this.allColumns[1].label
    },
    toolTip: this.toolTip,
    axisY: { suffix: " %" },
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[1].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.TFccDps
    }]
  };
  el1Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[2].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[2].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el1Dps
    }]
  };
  el2Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[3].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[3].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el2Dps
    }]
  };
  el3Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[4].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[4].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el3Dps
    }]
  };
  el4Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[5].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[5].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el4Dps
    }]
  };
  el5Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[6].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[6].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el5Dps
    }]
  };
  el6Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[7].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[7].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el6Dps
    }]
  };
  el7Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[8].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[8].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el7Dps
    }]
  };
  el8Options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: this.allColumns[9].label
    },
    axisY: { suffix: " %" },
    toolTip: this.toolTip,
    legend: this.legend,
    data: [{
      type: "splineArea",
      showInLegend: "true",
      name: this.allColumns[9].label,
      color: "black",
      xValueType: "dateTime",
      xValueFormatString: "DD MMM YY HH:mm",
      legendMarkerType: "square",
      dataPoints: this.el8Dps
    }]
  };
  

  getChartInstance = (chart: any) => {
    this.charts.push(chart);
  }

  ngAfterViewInit() {

    this.renderCharts();
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
