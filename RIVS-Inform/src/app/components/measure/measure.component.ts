import { Component, OnInit } from '@angular/core';
import { TableService } from '../../servises/table.service';
import { Measure } from '../../models/measure';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexChart,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: ApexGrid;
  colors: any;
};

export interface DisplayColumn {
  def: string;
  label: string;
  hide: boolean;
};

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  providers: [TableService],
  
})

export class TableMultipleHeader implements OnInit {
  public TFccoptions!: Partial<ChartOptions>;
  public chart1options!: Partial<ChartOptions>;
  public chart2options!: Partial<ChartOptions>;
  public chart3options!: Partial<ChartOptions>;
  public chart4options!: Partial<ChartOptions>;
  public chart5options!: Partial<ChartOptions>;
  public chart6options!: Partial<ChartOptions>;
  public chart7options!: Partial<ChartOptions>;
  public chart8options!: Partial<ChartOptions>;
  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false
    },

    stroke: {
      curve: "smooth"
    },
    markers: {
      size: 6,
      hover: {
        size: 10
      }
    },
    tooltip: {
      followCursor: false,
      theme: "light",
      
      x: {
        format: "dd-MM-yyyy HH:mm",
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return "";
          }
        }
      }
    },
    grid: {
    },
    xaxis: {
      labels: {
        datetimeUTC: false
      },
      type: "datetime"
    }
  };

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

  public initCharts(): void {
    this.TFccoptions = {
      title: {
        text: this.allColumns[1].label,
      },
      series: [
        {
          name: "TFcc",
          data: this.TFccDps
        }
      ],
      chart: {
        toolbar: {
          tools: {
            pan: false,
            download: false,
            zoom: false,
          }
          
        },
        id: "TFcc",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["black"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        },
        

      }
    };

    this.chart1options = {
      title: {
        text: this.allColumns[2].label,
      },
      series: [
        {
          name: 'el1',
          data: this.el1Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el1",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["red"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart2options = {
      title: {
        text: this.allColumns[3].label,
      },
      series: [
        {
          name: "el2",
          data: this.el2Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el2",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["blue"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart3options = {
      title: {
        text: this.allColumns[4].label,
      },
      series: [
        {
          name: "el3",
          data: this.el3Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el3",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["green"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart4options = {
      title: {
        text: this.allColumns[5].label,
      },
      series: [
        {
          name: "el4",
          data: this.el4Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el4",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["yellow"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart5options = {
      title: {
        text: this.allColumns[6].label,
      },
      series: [
        {
          name: "el5",
          data: this.el5Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el5",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["pink"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart6options = {
      title: {
        text: this.allColumns[7].label,
      },
      series: [
        {
          name: "el6",
          data: this.el6Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el6",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["gray"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart7options = {
      title: {
        text: this.allColumns[8].label,
      },
      series: [
        {
          name: "el7",
          data: this.el7Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el7",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["brown"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart8options = {
      title: {
        text: this.allColumns[9].label,
      },
      series: [
        {
          name: "el8",
          data: this.el8Dps
        }
      ],
      chart: {
        toolbar: {
          show: false,
          tools: {
            zoom: false
          }
        },
        id: "el8",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["orange"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };
  }

  ngOnInit(): void {
    this.selectedProdName = this.tableServ.productNameSelector()[0];
    this.fillColumns();
    this.hideColumns();
    this.productMeasures = this.tableServ.productSelector(this.selectedProdName);
    this.toggleDivsVisibility();
    this.fillCharts();
    this.initCharts();
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
    this.initCharts();
  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

  //data for CanvasJS
  TFccDps: any = []; el1Dps: any = []; el2Dps: any = []; el3Dps: any = [];
  el4Dps: any = []; el5Dps: any = []; el6Dps: any = []; el7Dps: any = [];
  el8Dps: any = [];

}
