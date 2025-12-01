import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { DataService } from '../../services/data.service';
import { Measure } from '../../models/measure';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NavMenuService } from '../../services/nav-menu.service';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, Observable, switchMap, of, combineLatest, map, filter, tap, } from 'rxjs';


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
  ApexGrid,
  ChartComponent,
  ApexOptions
} from "ng-apexcharts";
import { DomSanitizer } from '@angular/platform-browser';
import { ProductElements } from '../../models/productElements';
import { Enterprise } from '../../models/enterprise';
import { FormControl } from '@angular/forms';

//УБРАТЬ!
const REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>`;


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
}

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  providers: [DataService, provideNativeDateAdapter()],

})

//Разбить на отдельные компоненты
export class TableMultipleHeader implements OnInit
{
  //флаг готовности графиков
  //chartReady = false;

  //productCtrl = new FormControl(null);
  products$: Observable<ProductElements[]>;
  //selectedProductId: number | null = null;
  selectedProductName: string | undefined = undefined;

  enterprises$: Observable<Enterprise[]>;
  //selectedEnterpriseId: number | null = null;

  measures$: Observable<Measure[]>;

  selectedEnterpriseSubject = new BehaviorSubject<number | null>(null);
  selectedProductSubject = new BehaviorSubject<number | null>(null);

  pickerStartDate$ = new BehaviorSubject<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2));
  pickerEndDate$ = new BehaviorSubject<Date>(new Date());
  
  
  //Шаблон колонок таблицы
  allColumns: DisplayColumn[] = [
    { def: 'time', label: 'Время', hide: false },
    { def: 'TFcc', label: 'TF', hide: false },
    { def: 'el1', label: 'el1', hide: true },
    { def: 'el2', label: 'el2', hide: true },
    { def: 'el3', label: 'el3', hide: true },
    { def: 'el4', label: 'el4', hide: true },
    { def: 'el5', label: 'el5', hide: true },
    { def: 'el6', label: 'el6', hide: true },
    { def: 'el7', label: 'el7', hide: true },
    { def: 'el8', label: 'el8', hide: true }
  ];

  //data for charts
  @ViewChild('TFccChart') TFccChart!: ChartComponent;
  @ViewChild('el1Chart') el1Chart!: ChartComponent;
  @ViewChild('el2Chart') el2Chart!: ChartComponent;
  @ViewChild('el3Chart') el3Chart!: ChartComponent;
  @ViewChild('el4Chart') el4Chart!: ChartComponent;
  @ViewChild('el5Chart') el5Chart!: ChartComponent;
  @ViewChild('el6Chart') el6Chart!: ChartComponent;
  @ViewChild('el7Chart') el7Chart!: ChartComponent;
  @ViewChild('el8Chart') el8Chart!: ChartComponent;
  TFccDps: { x: Date; y: number }[] = []; el1Dps: { x: Date; y: number }[] = [];
  el2Dps: { x: Date; y: number }[] = []; el3Dps: { x: Date; y: number }[] = [];
  el4Dps: { x: Date; y: number }[] = []; el5Dps: { x: Date; y: number }[] = [];
  el6Dps: { x: Date; y: number }[] = []; el7Dps: { x: Date; y: number }[] = [];
  el8Dps: { x: Date; y: number }[] = [];

  //string array of columns name
  displayedColumns?: string[];
  
  constructor(public dataService: DataService, public navService: NavMenuService) {
    //УБРАТЬ
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral('refresh', sanitizer.bypassSecurityTrustHtml(REFRESH_ICON));

    this.enterprises$ = this.dataService.getEnterprises();

    this.products$ = this.selectedEnterpriseSubject.pipe(
      switchMap(enterpriseId => enterpriseId !== null
        ? this.dataService.getProducts(enterpriseId)
        : of([]) // пустой массив, если предприятие не выбрано
      )
    );

    this.selectedEnterpriseSubject.subscribe(() => {
      // каждый раз при выборе нового предприятия — сбрасываем продукт
      this.selectedProductSubject.next(null);
      this.selectedProductName = undefined;
    });
    
    this.measures$ = combineLatest([
      this.selectedProductSubject,
      this.products$,
      this.pickerStartDate$,
      this.pickerEndDate$
    ]).pipe(
      filter(([productId, , ,]) => productId != null),
        switchMap(([productId, products, startDate, endDate]) => {
          const product = products.find(p => p.id === productId);
          this.fillColumns(product);
          this.selectedProductName = product?.name;
          return this.dataService.getMeasures(productId!, startDate, endDate);
        })
    );

    this.measures$.subscribe(mes =>
    {
      this.updateCharts(mes);
    });
    
  }

  ngOnInit()
  {
  }
  
  fillCharts(measures: Measure[]) {
    const updateData = (target: { x: Date, y: number }[], getter: (m: Measure) => number | undefined) => {
      target.length = 0; // очищаем массив, не создавая новый
      measures.forEach(m => target.push({ x: new Date(m.time), y: getter(m) ?? 0 }));
    };

    if (measures && measures.length > 0) {
      updateData(this.TFccDps, m => m.tfcc ?? 0);
      updateData(this.el1Dps, m => m.el1 ?? 0);
      updateData(this.el2Dps, m => m.el2 ?? 0);
      updateData(this.el3Dps, m => m.el3 ?? 0);
      updateData(this.el4Dps, m => m.el4 ?? 0);
      updateData(this.el5Dps, m => m.el5 ?? 0);
      updateData(this.el6Dps, m => m.el6 ?? 0);
      updateData(this.el7Dps, m => m.el7 ?? 0);
      updateData(this.el8Dps, m => m.el8 ?? 0);
    }
    else {
      [this.TFccDps, this.el1Dps, this.el2Dps, this.el3Dps, this.el4Dps,
      this.el5Dps, this.el6Dps, this.el7Dps, this.el8Dps].forEach(arr => arr.length = 0);
    }
  }
  
  //fill columns data
  fillColumns(product: ProductElements | undefined) {
    let elems: string[] = [];
    if (product) {
      for (const key in product) {
        if (key.includes('el')) {
          const value = product[key as keyof ProductElements];
          if (typeof value === 'string') {
            elems.push(value);
          }
        }
      }
    }
    
    if (this.selectedEnterpriseSubject) {
      this.allColumns.find(col => col.def === 'TFcc')!.hide = false;
    }
    else {
      this.allColumns.find(col => col.def === 'TFcc')!.hide = true;
    }

    for (let i = 1; i < 9; i++) {
      if (elems[i - 1] != null && elems[i - 1] != undefined && elems[i - 1] != '') {
        this.allColumns.find(col => col.def === 'el' + i)!.label = elems[i - 1];
        this.allColumns.find(col => col.def === 'el' + i)!.hide = false;
      }
      else {
        this.allColumns.find(col => col.def === 'el' + i)!.hide = true;
      }
    }
    this.hideColumns();
  }

  //обновление базы данных
  updateDb() {
    this.dataService.updateDb()
      .pipe(
        tap(res => alert(res?.message ?? 'Не получено ответа от сервера'))
      )
      .subscribe({
        next: () => console.log('Update finished'),
        error: err => alert('Ошибка при обновлении базы: ' + err)
      });
  }
  
  //событие ввода даты
  addEvent(type: 'inputStartDate' | 'inputEndDate', event: any) {
    const date = event.value;
    if (type === 'inputStartDate') {
      this.pickerStartDate$.next(date);
    } else {
      this.pickerEndDate$.next(date);
    }
  }
  
  public updateCharts(measures: Measure[]) {

    //заполняем данные
    this.fillCharts(measures);

    // Обновляем title, series, создавая новый массив
    this.TFccoptions.title = { text: this.allColumns[1].label + " %" };
    this.TFccoptions.series = [
      {
        name: this.allColumns[1].label,
        data: this.TFccDps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];
    this.chart1options.title = { text: this.allColumns[2].label + " %" };
    this.chart1options.series = [
      {
        name: this.allColumns[2].label,
        data: this.el1Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart2options.title = { text: this.allColumns[3].label + " %" };
    this.chart2options.series = [
      {
        name: this.allColumns[3].label,
        data: this.el2Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart3options.title = { text: this.allColumns[4].label + " %" };
    this.chart3options.series = [
      {
        name: this.allColumns[4].label,
        data: this.el3Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart4options.title = { text: this.allColumns[5].label + " %" };
    this.chart4options.series = [
      {
        name: this.allColumns[5].label,
        data: this.el4Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart5options.title = { text: this.allColumns[6].label + " %" };
    this.chart5options.series = [
      {
        name: this.allColumns[6].label,
        data: this.el5Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart6options.title = { text: this.allColumns[7].label + " %" };
    this.chart6options.series = [
      {
        name: this.allColumns[7].label,
        data: this.el6Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart7options.title = { text: this.allColumns[8].label + " %" };
    this.chart7options.series = [
      {
        name: this.allColumns[8].label,
        data: this.el7Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    this.chart8options.title = { text: this.allColumns[9].label + " %" };
    this.chart8options.series = [
      {
        name: this.allColumns[9].label,
        data: this.el8Dps.map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
      }
    ];

    if (this.TFccChart) {
      this.TFccChart.updateSeries(this.TFccoptions.series, true);
    }
    if (this.el1Chart) {
      this.el1Chart.updateSeries(this.chart1options.series, true);
    }
    if (this.el2Chart) {
      this.el2Chart.updateSeries(this.chart2options.series, true);
    }
    if (this.el3Chart) {
      this.el3Chart.updateSeries(this.chart3options.series, true);
    }
    if (this.el4Chart) {
      this.el4Chart.updateSeries(this.chart4options.series, true);
    }
    if (this.el5Chart) {
      this.el5Chart.updateSeries(this.chart5options.series, true);
    }
    if (this.el6Chart) {
      this.el6Chart.updateSeries(this.chart6options.series, true);
    }
    if (this.el7Chart) {
      this.el7Chart.updateSeries(this.chart7options.series, true);
    }
    if (this.el8Chart) {
      this.el8Chart.updateSeries(this.chart8options.series, true);
    }
  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

  //ДАЛЕЕ ОПЦИИ ГРАФИКОВ
  //public initCharts() {
  //  this.TFccoptions = {
  //    ...this.TFccoptions,
  //    title: {
  //      text: this.allColumns[1].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[1].label,
  //        data: this.TFccDps
  //      }
  //    ],

  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        tools: {
  //          pan: false,
  //          download: false,
  //          zoom: false,
  //        }

  //      },
  //      id: "TFcc",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["black"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      },


  //    }
  //  };
  //  this.chart1options = {
  //    ...this.chart1options,
  //    title: {
  //      text: this.allColumns[2].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[2].label,
  //        data: this.el1Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el1",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["DarkRed"],
  //    yaxis: {

  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart2options = {
  //    ...this.chart2options,
  //    title: {
  //      text: this.allColumns[3].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[3].label,
  //        data: this.el2Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el2",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["DarkBlue"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart3options = {
  //    ...this.chart3options,
  //    title: {
  //      text: this.allColumns[4].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[4].label,
  //        data: this.el3Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el3",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["DarkGreen"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart4options = {
  //    ...this.chart4options,
  //    title: {
  //      text: this.allColumns[5].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[5].label,
  //        data: this.el4Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el4",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["orange"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart5options = {
  //    ...this.chart5options,
  //    title: {
  //      text: this.allColumns[6].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[6].label,
  //        data: this.el5Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el5",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["Coral"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart6options = {
  //    ...this.chart6options,
  //    title: {
  //      text: this.allColumns[7].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[7].label,
  //        data: this.el6Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el6",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["gray"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart7options = {
  //    ...this.chart7options,
  //    title: {
  //      text: this.allColumns[8].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[8].label,
  //        data: this.el7Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el7",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["brown"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.chart8options = {
  //    ...this.chart8options,
  //    title: {
  //      text: this.allColumns[9].label + " %",
  //    },
  //    series: [
  //      {
  //        name: this.allColumns[9].label,
  //        data: this.el8Dps
  //      }
  //    ],
  //    chart: {
  //      zoom: { enabled: false },
  //      toolbar: {
  //        show: false,
  //        tools: {
  //          zoom: false
  //        }
  //      },
  //      id: "el8",
  //      group: "social",
  //      type: "area",
  //      height: 160
  //    },
  //    colors: ["Olive"],
  //    yaxis: {
  //      tickAmount: 2,
  //      labels: {
  //        minWidth: 40
  //      }
  //    }
  //  };
  //  this.commonOptions = {
  //    dataLabels: {
  //      enabled: false
  //    },

  //    stroke: {
  //      curve: "smooth"
  //    },
  //    markers: {
  //      size: 6,
  //      hover: {
  //        size: 10
  //      }
  //    },
  //    tooltip: {
  //      followCursor: false,
  //      theme: "dark",
  //      x: {
  //        format: "dd-MM-yyyy HH:mm",
  //        show: true
  //      },
  //      marker: {
  //        show: false
  //      },
  //    },
  //    grid: {
  //    },
  //    xaxis: {
  //      tooltip: {
  //        enabled: false
  //      },
  //      labels: {
  //        datetimeUTC: false
  //      },
  //      type: "datetime"
  //    },
  //  };
  //}
  public TFccoptions: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[1].label + " %",
    },
    series: [
      {
        name: this.allColumns[1].label,
        data: this.el5Dps
      }
    ],
    chart: {
      zoom: { enabled: false },
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
  public chart1options: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[2].label + " %",
    },
    series: [
      {
        name: this.allColumns[2].label,
        data: this.el5Dps
      }
    ],
    chart: {
      zoom: { enabled: false },
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
  public chart2options: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[3].label + " %",
    },
    series: [
      {
        name: this.allColumns[3].label,
        data: this.el5Dps
      }
    ],
    chart: {
      zoom: { enabled: false },
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
  public chart3options: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[4].label + " %",
    },
    series: [
      {
        name: this.allColumns[4].label,
        data: this.el5Dps
      }
    ],
    chart: {
      zoom: { enabled: false },
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
  public chart4options: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[5].label + " %",
    },
    series: [
      {
        name: this.allColumns[5].label,
        data: this.el5Dps
      }
    ],
    chart: {
      zoom: { enabled: false },
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
  public chart5options: Partial<ChartOptions> = {
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
      zoom: { enabled: false },
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
  public chart6options: Partial<ChartOptions> = {
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
      zoom: { enabled: false },
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
  public chart7options: Partial<ChartOptions> = {
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
      zoom: { enabled: false },
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
  public chart8options: Partial<ChartOptions> = {
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
      zoom: { enabled: false },
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
