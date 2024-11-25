import { Component, OnInit } from '@angular/core';
import { TableService } from '../../services/data.service';
import { Measure } from '../../models/measure';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NavMenuService } from '../../services/nav-menu.service';
import { MatIconModule } from '@angular/material/icon';


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
import { firstValueFrom } from 'rxjs';


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
  toolbar: any;
};

export interface DisplayColumn {
  def: string;
  label: string;
  hide: boolean;
};

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  providers: [TableService, provideNativeDateAdapter()],

})

export class TableMultipleHeader implements OnInit {

  startDate?: Date;
  endDate?: Date;

  //флаг загрузки данных. Если данных ещё нет, элементы графиков не рендерятся
  public loadedFlag = Promise.resolve(false);

  public TFccoptions!: Partial<ChartOptions>;
  public chart1options!: Partial<ChartOptions>;
  public chart2options!: Partial<ChartOptions>;
  public chart3options!: Partial<ChartOptions>;
  public chart4options!: Partial<ChartOptions>;
  public chart5options!: Partial<ChartOptions>;
  public chart6options!: Partial<ChartOptions>;
  public chart7options!: Partial<ChartOptions>;
  public chart8options!: Partial<ChartOptions>;

  //Шаблок колонок таблицы
  allColumns: DisplayColumn[] = [
    { def: 'time', label: 'Время', hide: false },
    { def: 'TFcc', label: 'TF', hide: false },
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
  selectedProdName?: string;

  //string array of enterprise name
  enterpriseNames?: string[];

  //string array for DOM
  productsNames?: string[]

  //выбранное предприятие
  selectedEnterprise?: string;

  productMeasures: Measure[] = [];

  //string array of columns name
  displayedColumns?: string[];

  constructor(public tableServ: TableService, public navService: NavMenuService) { }

  ngOnInit(): void {
    //получение списка предприятий, продуктов и последней даты измерений для пользователя
    this.tableServ.getAllData(this.navService.userName.value!)
      .subscribe(async result => {
        //получение имён предприятий
        this.enterpriseNames = result.enterpeises.map(es => es.name);

        //выбор первого предприятия из списка
        this.selectedEnterprise = this.enterpriseNames[0];

        //заполнение списка продуктов для первого предприятия
        //сервер отправляет список продуктов для первого предприятия
        this.tableServ.productElements = result.products;
        this.productsNames = this.tableServ.productElements.map(pe => pe.name);

        //заполнение datepicker
        this.startDate = new Date(result.lastDate[0]);
        this.endDate = new Date(result.lastDate[0]);


        //выбор первого продукта из списка
        this.selectedProdName = this.tableServ.productNameSelector()[0];

        //получение списка измерений
        this.tableServ.measures =
          (await firstValueFrom(this.tableServ.
            getMeasures(this.selectedEnterprise, this.selectedProdName, this.startDate, this.endDate))).reverse();


        this.fillColumns();
        this.hideColumns();

        this.productMeasures = this.tableServ.measures;

        this.loadedFlag = Promise.resolve(true);

        this.toggleDivsVisibility();
        this.fillCharts();
        this.initCharts();

      });

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
      this.TFccDps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].TFcc)
      };
      this.el1Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el1)
      };
      this.el2Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el2)
      };
      this.el3Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el3)
      };
      this.el4Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el4)
      };
      this.el5Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el5)
      };
      this.el6Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el6)
      };
      this.el7Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el7)
      };
      this.el8Dps[i] = {
        x: Number(Math.round(new Date(this.productMeasures[i].time).
          getTime())), y: Number(this.productMeasures[i].el8)
      };

    }
  }

  //scroll disable/enable
  toggleBodyScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
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
    })
  }

  //fill columns data
  fillColumns() {
    const elems = this.tableServ.productElementsSelector(this.selectedProdName!);
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

  //обновление базы данных
  async updateDb() {

    var result = await firstValueFrom(this.tableServ.updateDb(new Date));

    this.fillColumns();
    this.hideColumns();

    this.tableServ.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!,
      this.selectedProdName!, this.startDate, this.endDate))).reverse();
    this.productMeasures = this.tableServ.measures;

    this.toggleDivsVisibility();
    this.fillCharts();
    this.initCharts();
  }

  //change selected product
  async selectProd(value: string) {
    this.selectedProdName = value;

    this.fillColumns();
    this.hideColumns();

    this.tableServ.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!,
      this.selectedProdName, this.startDate, this.endDate))).reverse();
    this.productMeasures = this.tableServ.measures;
    
    this.toggleDivsVisibility();
    this.fillCharts();
    this.initCharts();
  }

  //change selected enterprise
  async selectEnterprise(value: string) {
    this.selectedEnterprise = value;

    //получение списка продуктов выбранного предприятия
    this.tableServ.productElements = await firstValueFrom(this.tableServ.getProducts(this.selectedEnterprise));
    this.productsNames = this.tableServ.productElements.map(pe => pe.name);

    //выбор первого продукта из списка
    this.selectedProdName = this.tableServ.productNameSelector()[0];

    //получение списка измерений
    this.tableServ.measures = (await firstValueFrom(this.tableServ.
      getMeasures(this.selectedEnterprise, this.selectedProdName, this.startDate!, this.endDate!))).reverse();
    this.productMeasures = this.tableServ.measures;

    this.fillColumns();
    this.hideColumns();
    this.toggleDivsVisibility();
    this.fillCharts();
    this.initCharts();
  }

  //событие ввода даты
  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

    if (type === 'inputStartDate') {
      this.startDate = event.value!;
    }
    else {
      this.endDate = event.value!;
    }
    //получение списка измерений
    this.tableServ.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!, this.selectedProdName!, this.startDate!, this.endDate!))).reverse();
    this.productMeasures = this.tableServ.measures;

    this.toggleDivsVisibility();
    this.fillCharts();
    this.initCharts();

  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

  //data for charts
  TFccDps: any = []; el1Dps: any = []; el2Dps: any = []; el3Dps: any = [];
  el4Dps: any = []; el5Dps: any = []; el6Dps: any = []; el7Dps: any = [];
  el8Dps: any = [];

  //ДАЛЕЕ ОПЦИИ ГРАФИКОВ

  //заполнение опций графиков
  public initCharts(): void {
    this.TFccoptions = {
      title: {
        text: this.allColumns[1].label + " %",
      },
      series: [
        {
          name: this.allColumns[1].label,
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
        text: this.allColumns[2].label + " %",
      },
      series: [
        {
          name: this.allColumns[2].label,
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
      colors: ["DarkRed"],
      yaxis: {

        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart2options = {
      title: {
        text: this.allColumns[3].label + " %",
      },
      series: [
        {
          name: this.allColumns[3].label,
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
      colors: ["DarkBlue"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart3options = {
      title: {
        text: this.allColumns[4].label + " %",
      },
      series: [
        {
          name: this.allColumns[4].label,
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
      colors: ["DarkGreen"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart4options = {
      title: {
        text: this.allColumns[5].label + " %",
      },
      series: [
        {
          name: this.allColumns[5].label,
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
      colors: ["orange"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart5options = {
      title: {
        text: this.allColumns[6].label + " %",
      },
      series: [
        {
          name: this.allColumns[6].label,
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
      colors: ["Coral"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart6options = {
      title: {
        text: this.allColumns[7].label + " %",
      },
      series: [
        {
          name: this.allColumns[7].label,
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
        text: this.allColumns[8].label + " %",
      },
      series: [
        {
          name: this.allColumns[8].label,
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
        text: this.allColumns[9].label + " %",
      },
      series: [
        {
          name: this.allColumns[9].label,
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
      colors: ["Olive"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };
  }

  //Общие обции для графиков
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
      theme: "dark",
      x: {
        format: "dd-MM-yyyy HH:mm",
        show: true
      },

      marker: {
        show: false
      },
    },
    grid: {
    },
    xaxis: {
      tooltip: {
        enabled: false
      },
      labels: {
        datetimeUTC: false
      },
      type: "datetime"
    },
  };
}
