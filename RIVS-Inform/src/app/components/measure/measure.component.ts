import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Measure } from '../../models/measure';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NavMenuService } from '../../services/nav-menu.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, Observable, switchMap, of, combineLatest, map, } from 'rxjs';


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
import { DomSanitizer } from '@angular/platform-browser';
import { ProductElements } from '../../models/productElements';
import { Enterprise } from '../../models/enterprise';

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
};

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  providers: [DataService, provideNativeDateAdapter()],

})

//Разбить на отдельные компоненты
export class TableMultipleHeader implements OnInit {

  products$: Observable<ProductElements[]>;
  selectedProductId: number | null = null;
  selectedProductName: string | undefined = undefined;

  enterprises$: Observable<Enterprise[]>;
  selectedEnterpriseId: number | null = null;

  measures$: Observable<Measure[]>;

  selectedEnterpriseSubject = new BehaviorSubject<number | null>(null);
  selectedProductSubject = new BehaviorSubject<number | null>(null);

  startDate: Observable<Date> = of(new Date());
  endDate: Observable<Date> = of(new Date());

  //флаг загрузки данных. Если данных ещё нет, элементы графиков не рендерятся
  //public loadedFlag = Promise.resolve(false);

  public TFccoptions!: Partial<ChartOptions>;
  public chart1options!: Partial<ChartOptions>;
  public chart2options!: Partial<ChartOptions>;
  public chart3options!: Partial<ChartOptions>;
  public chart4options!: Partial<ChartOptions>;
  public chart5options!: Partial<ChartOptions>;
  public chart6options!: Partial<ChartOptions>;
  public chart7options!: Partial<ChartOptions>;
  public chart8options!: Partial<ChartOptions>;

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
  TFccDps: any = []; el1Dps: any = []; el2Dps: any = []; el3Dps: any = [];
  el4Dps: any = []; el5Dps: any = []; el6Dps: any = []; el7Dps: any = [];
  el8Dps: any = [];

  //string array of columns name
  displayedColumns?: string[];

  //enterprises?: Enterprise[];
  //selectedEnterprise?: string;
  //productMeasures: Measure[] = [];
  //displayedColumns?: string[];

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

    //this.measures$ = this.selectedProductSubject.pipe(
    //  switchMap(productId => productId !== null
    //    ? this.dataService.getMeasures(productId)
    //    : of([])// пустой массив, если продукт не выбран
    //  )
    //);

    this.measures$ = combineLatest([
      this.selectedProductSubject,
      this.startDate, this.endDate
    ]).pipe(
      switchMap(([productId, startDate, endDate]) => {
        return productId !== null ?
          this.dataService.getMeasures(productId, startDate, endDate)
            : of([])
      })
    );

    this.startDate = this.selectedEnterpriseSubject.pipe(
      switchMap(enterpriseId => enterpriseId !== null
        ? this.dataService.getLastDate(enterpriseId)
        : of(new Date()) // текушая дата, если предприятие не выбрано
      )
    );

    this.measures$.subscribe(mes =>
    {
      //this.fillColumns();
      //this.hideColumns();
      //this.toggleDivsVisibility();
      this.fillCharts(mes);
    }
    );
    
}
  ngOnInit(){
    ////получение списка предприятий, продуктов и последней даты измерений для пользователя
    //this.dataService.getAllData(this.navService.userName.value!)
    //  .subscribe(async result => {
    //    //получение имён предприятий
    //    this.enterpriseNames = result.enterpeises.map(es => es.name);

    //    //выбор первого предприятия из списка
    //    this.selectedEnterprise = this.enterpriseNames[0];

    //    //заполнение списка продуктов для первого предприятия
    //    //сервер отправляет список продуктов для первого предприятия
    //    this.tableServ.productElements = result.products;
    //    this.productsNames = this.tableServ.productElements.map(pe => pe.name);

    //    //заполнение datepicker
    //    this.startDate = new Date(result.lastDate[0]);
    //    this.endDate = new Date(result.lastDate[0]);


    //    //выбор первого продукта из списка
    //    this.selectedProdName = this.tableServ.productNameSelector()[0];

    //    //получение списка измерений
    //    this.tableServ.measures =
    //      (await firstValueFrom(this.tableServ.
    //        getMeasures(this.selectedEnterprise, this.selectedProdName, this.startDate, this.endDate))).reverse();


    //    this.fillColumns();
    //    this.hideColumns();

    //    this.productMeasures = this.tableServ.measures;

    //    this.loadedFlag = Promise.resolve(true);

    //    this.toggleDivsVisibility();
    //    this.fillCharts();
    //    this.initCharts();

    //  });

    //this.fillColumns();
    //this.hideColumns();

    //this.loadedFlag = Promise.resolve(true);

    /*this.toggleDivsVisibility();*/
    //this.fillCharts();
    //this.initCharts();

    // Подписываемся на изменения выбранного продукта
    combineLatest([this.products$, this.selectedProductSubject]).subscribe(
      ([products, selectedId]) => {
        this.fillColumns(products.find(p => p.id === selectedId));
        this.selectedProductName = products.find(p => p.id === selectedId)?.name;
      }
    );
    //this.selectedEnterpriseSubject.subscribe(id => {
    //  this.selectedProductId = null;
    //  //this.selectedProduct = undefined;
    //  this.onProductChange(null);
    //});
  }

  onEnterpriseChange(enterpriseId: string) {
    this.selectedEnterpriseId = +enterpriseId;
    this.selectedProductId = null;// сброс выбора продукта
    this.onProductChange(null);
    this.selectedEnterpriseSubject?.next(this.selectedEnterpriseId);
  }

  onProductChange(productId: string | null) {
    this.selectedProductId = productId ? +productId : null;
    this.selectedProductSubject?.next(this.selectedProductId);
    //this.toggleDivsVisibility();
    this.hideColumns();
    this.initCharts();
    //this.fillColumns();
    //this.hideColumns();
    //this.toggleDivsVisibility();
    ///*this.fillCharts();*/
    //this.initCharts();
  }

  //fill charts data
  fillCharts(measures: Measure[]) {
    //while (this.TFccDps.length != 0) {
    //  this.TFccDps.shift();
    //  this.el1Dps.shift();
    //  this.el2Dps.shift();
    //  this.el3Dps.shift();
    //  this.el4Dps.shift();
    //  this.el5Dps.shift();
    //  this.el6Dps.shift();
    //  this.el7Dps.shift();
    //  this.el8Dps.shift();
    //}
    this.TFccDps = [];
    this.el1Dps = [];
    this.el2Dps = [];
    this.el3Dps = [];
    this.el4Dps = [];
    this.el5Dps = [];
    this.el6Dps = [];
    this.el7Dps = [];
    this.el8Dps = [];

    for (var i = 0; i < measures.length; i++) {
      this.TFccDps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].TFcc)
      };
      this.el1Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el1)
      };
      this.el2Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el2)
      };
      this.el3Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el3)
      };
      this.el4Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el4)
      };
      this.el5Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el5)
      };
      this.el6Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el6)
      };
      this.el7Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el7)
      };
      this.el8Dps[i] = {
        x: Number(Math.round(new Date(measures[i].time).
          getTime())), y: Number(measures[i].el8)
      };

    }
  }

  //scroll disable/enable
  toggleBodyScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  //show(hide) charts
  //toggleDivsVisibility() {
  //  var divsOfCharts = [
  //    document.getElementById('TFcc'),
  //    document.getElementById('el1'),
  //    document.getElementById('el2'),
  //    document.getElementById('el3'),
  //    document.getElementById('el4'),
  //    document.getElementById('el5'),
  //    document.getElementById('el6'),
  //    document.getElementById('el7'),
  //    document.getElementById('el8'),
  //  ];
  //  divsOfCharts.forEach((el) => {
  //    if (el)
  //    {
  //      const column = this.allColumns.find(col => col.def === el.id);
  //      if (column) {
  //        el.style.display = column.hide ? 'none' : 'block';
  //      }
  //    }
      
  //  })
  //}

  //fill columns data
  fillColumns(product: ProductElements | undefined) {
    /*const elems = this.dataService.productElementsSelector(this.selectedProdName!);*/
    //let product = this.products$.;
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
    this.dataService.updateDb().pipe(map(res => alert(res.message)));
    if (this.selectedProductId){
      this.onProductChange(this.selectedProductId.toString());
    }
    
    //if (result.dateFrom == undefined || new Date(result.dateFrom).getFullYear() == 0 ) {
    //  alert('Ошибка синхронизации');
    //}
    //else {
    //  if (result.newMeasuresCount == 0) {
    //    alert('Новых измерений не найдено');
    //  }
    //  else {
    //    alert('Успешная синхронизация. Добавлено: ' + result.addRowsCount + ' измерений');
    //  }
    //}
    
    //this.fillColumns();
    //this.hideColumns();

    //this.tableServ.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!,
    //  this.selectedProdName!, this.startDate, this.endDate))).reverse();
    //this.productMeasures = this.tableServ.measures;

    //this.toggleDivsVisibility();
    //this.fillCharts();
    //this.initCharts();
  }

  //change selected product
  //async selectProd(value: string) {
  //  this.selectedProdName = value;

  //  this.fillColumns();
  //  this.hideColumns();

  //  this.tableServ.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!,
  //    this.selectedProdName, this.startDate, this.endDate))).reverse();
  //  this.productMeasures = this.tableServ.measures;
    
  //  this.toggleDivsVisibility();
  //  this.fillCharts();
  //  this.initCharts();
  //}

  //change selected enterprise
  //async selectEnterprise(value: string) {
  //  this.selectedEnterprise = value;

  //  //получение списка продуктов выбранного предприятия
  //  this.tableServ.productElements = await firstValueFrom(this.tableServ.getProducts(this.selectedEnterprise));
  //  this.productsNames = this.tableServ.productElements.map(pe => pe.name);

  //  //выбор первого продукта из списка
  //  this.selectedProdName = this.tableServ.productNameSelector()[0];

  //  //получение списка измерений
  //  this.tableServ.measures = (await firstValueFrom(this.tableServ.
  //    getMeasures(this.selectedEnterprise, this.selectedProdName, this.startDate!, this.endDate!))).reverse();
  //  this.productMeasures = this.tableServ.measures;

  //  this.fillColumns();
  //  this.hideColumns();
  //  this.toggleDivsVisibility();
  //  this.fillCharts();
  //  this.initCharts();
  //}

  //событие ввода даты
  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

    if (type === 'inputStartDate') {
      this.startDate = of(event.value ?? new Date());
    }
    else {
      this.endDate = of(event.value ?? new Date());
    }
    //получение списка измерений
    /*this.dataService.measures = (await firstValueFrom(this.tableServ.getMeasures(this.selectedEnterprise!, this.selectedProdName!, this.startDate!, this.endDate!))).reverse();*/
    /*this.productMeasures = this.tableServ.measures;*/

    /*this.toggleDivsVisibility();*/
    /*this.fillCharts();*/
    /*this.initCharts();*/

  }

  // Show/Hide columns
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }
  
  //ДАЛЕЕ ОПЦИИ ГРАФИКОВ

  //заполнение опций графиков
  public initCharts() {
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
