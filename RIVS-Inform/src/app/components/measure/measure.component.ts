import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { DataService } from '../../services/data.service';
import { Measure } from '../../models/measure';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NavMenuService } from '../../services/nav-menu.service';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, switchMap, of, combineLatest, map, filter, tap, distinctUntilChanged, shareReplay, } from 'rxjs';
import { AuthService } from '../../auth/auth.service';


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
  ChartComponent
} from "ng-apexcharts";
import { DomSanitizer } from '@angular/platform-browser';
import { ProductElements } from '../../models/productElements';

//иконка обновления
const REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>`;
//иконка скачивания csv
const DOWNLOAD_CSV_ICON = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path style="fill:#314E55;" d="M511.867,234.008c-0.061-0.969-0.25-1.901-0.57-2.818c-0.119-0.341-0.205-0.677-0.357-1.003 c-0.514-1.104-1.162-2.151-2.053-3.046c-0.006-0.006-0.01-0.014-0.01-0.014L448,166.25v-59.583c0-0.232-0.118-0.44-0.133-0.672 c-0.06-0.941-0.242-1.846-0.546-2.741c-0.117-0.342-0.206-0.676-0.357-1.005c-0.519-1.133-1.173-2.21-2.088-3.124l-96-96 c-0.919-0.919-1.998-1.575-3.135-2.095c-0.318-0.146-0.639-0.233-0.97-0.345c-0.912-0.315-1.839-0.5-2.802-0.559 C341.75,0.112,341.553,0,341.333,0H74.667C68.776,0,64,4.776,64,10.667V166.25L3.128,227.122c0,0-0.009,0.013-0.016,0.019 c-0.891,0.894-1.539,1.941-2.053,3.046c-0.152,0.326-0.238,0.661-0.357,1.003c-0.32,0.917-0.509,1.849-0.57,2.818 C0.118,234.238,0,234.432,0,234.667v202.667C0,443.224,4.776,448,10.667,448H64v53.333C64,507.224,68.776,512,74.667,512h362.667 c5.891,0,10.667-4.776,10.667-10.667V448h53.333c5.891,0,10.667-4.776,10.667-10.667V234.667 C512,234.432,511.882,234.238,511.867,234.008z"/><polygon style="fill:#EAEAEA;" points="475.583,224 448,224 448,196.417 "/><polygon style="fill:#D8D8D8;" points="411.583,96 352,96 352,36.417 "/><g><path style="fill:#EAEAEA;" d="M85.333,21.333h245.333v85.333c0,5.891,4.776,10.667,10.667,10.667h85.333v53.333V224H85.333 v-53.333V21.333z"/><polygon style="fill:#EAEAEA;" points="64,196.417 64,224 36.417,224 "/><rect x="85.333" y="448" style="fill:#EAEAEA;" width="341.333" height="42.667"/></g><polygon style="fill:#E9E7D1;" points="490.667,426.667 21.333,426.667 21.333,245.333 74.667,245.333 437.333,245.333 490.667,245.333 "/><g><path style="fill:#314E55;" d="M249.835,297.44c1.572-1.45,3.325-2.506,5.258-3.178c1.934-0.661,3.929-0.992,5.984-0.992 c7.132,0,13.056,2.837,17.771,8.522l11.967-15.594c-3.505-4.107-7.827-7.221-12.965-9.345c-5.138-2.112-10.971-3.168-17.499-3.168 c-4.473,0-8.885,0.758-13.238,2.262c-4.351,1.514-8.251,3.84-11.696,6.987c-3.445,3.146-6.226,7.104-8.341,11.871 c-2.116,4.78-3.173,10.496-3.173,17.142c0,5.323,0.695,9.878,2.085,13.685c1.39,3.819,3.264,7.137,5.621,9.974 c2.357,2.848,5.078,5.29,8.16,7.349c3.083,2.059,6.377,3.926,9.883,5.621c5.561,2.784,10.154,5.803,13.781,9.068 c3.626,3.263,5.44,7.68,5.44,13.237c0,5.685-1.512,10.09-4.534,13.237c-3.022,3.147-6.83,4.715-11.424,4.715 c-4.11,0-8.13-0.97-12.059-2.901s-7.284-4.598-10.064-7.979l-11.787,15.957c3.627,4.236,8.462,7.734,14.507,10.518 c6.044,2.784,12.633,4.171,19.765,4.171c4.956,0,9.671-0.842,14.144-2.539c4.473-1.695,8.372-4.203,11.696-7.53 c3.325-3.318,5.984-7.404,7.979-12.236c1.994-4.832,2.991-10.4,2.991-16.682c0-5.44-0.846-10.155-2.538-14.145 c-1.693-3.988-3.869-7.434-6.528-10.336c-2.659-2.901-5.621-5.375-8.885-7.434c-3.264-2.06-6.467-3.872-9.611-5.44 c-5.319-2.656-9.611-5.473-12.874-8.438c-3.264-2.954-4.897-7.158-4.897-12.598c0-3.147,0.454-5.867,1.36-8.16 C247.024,300.768,248.263,298.891,249.835,297.44z"/><path style="fill:#314E55;" d="M161.888,307.776c2.176-4.234,4.896-7.585,8.16-10.069c3.264-2.475,7.072-3.712,11.424-3.712 c7.858,0,14.265,3.562,19.221,10.698l12.512-15.232c-3.505-5.077-8.039-8.97-13.6-11.701c-5.561-2.72-12.029-4.075-19.403-4.075 c-7.132,0-13.63,1.664-19.493,4.982c-5.863,3.328-10.85,7.979-14.96,13.962c-4.11,5.995-7.283,13.12-9.52,21.397 c-2.236,8.289-3.354,17.323-3.354,27.116c0,9.792,1.118,18.794,3.354,27.018c2.237,8.224,5.379,15.318,9.43,21.301 c4.05,5.995,9.006,10.677,14.869,14.059s12.421,5.078,19.674,5.078c7.979,0,14.598-1.568,19.856-4.715 c5.258-3.147,9.581-7.254,12.966-12.331l-12.512-14.687c-2.055,3.146-4.624,5.802-7.706,7.978 c-3.083,2.176-6.739,3.264-10.971,3.264c-4.473,0-8.372-1.237-11.696-3.723c-3.324-2.475-6.075-5.824-8.251-10.059 s-3.808-9.216-4.896-14.966c-1.088-5.738-1.632-11.807-1.632-18.217c0-6.529,0.544-12.661,1.632-18.411 C158.08,316.992,159.712,312.01,161.888,307.776z"/><polygon style="fill:#314E55;" points="341.408,379.947 340.864,379.947 319.467,276.949 295.168,276.949 326.538,405.333 354.102,405.333 386.016,276.949 362.805,276.949 "/></g></svg>';

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
  styleUrls: ['./measure.component.css']
})

//TODO: Разбить на отдельные компоненты
export class TableMultipleHeader implements OnInit
{
  authService = inject(AuthService);
  
  isAdmin$ = this.authService.isAdmin$; // Observable<boolean>
  
  selectedEnterpriseSubject = new BehaviorSubject<number | null>(null);
  selectedProductSubject = new BehaviorSubject<number | null>(null);

  pickerStartDate$ = new BehaviorSubject<Date | null>(null);
  pickerEndDate$ = new BehaviorSubject<Date | null>(null);

  products$ = this.selectedEnterpriseSubject.pipe(
    switchMap(enterpriseId => enterpriseId !== null
      ? this.dataService.getProducts(enterpriseId)
      : of([]) // пустой массив, если предприятие не выбрано
    )
  );
  selectedProductName: string | undefined = undefined;

  enterprises$ = this.dataService.getEnterprises();

  refresh$ = new BehaviorSubject<void>(undefined);

  page$ = new BehaviorSubject({ pageIndex: 0, pageSize: 10 });
  total: number = 0;

  //для таблицы
  tableMeasures$ = combineLatest([
    this.selectedProductSubject,
    this.products$,
    this.pickerStartDate$,
    this.pickerEndDate$,
    this.page$
  ]).pipe(
    filter(([productId, , pickerStartDate, pickerEndDate]) =>
      productId != null && pickerStartDate != null && pickerEndDate != null
    ),
    switchMap(([productId, products, startDate, endDate, page]) => {
      const product = products.find(p => p.id === productId);
      this.fillColumns(product);
      this.selectedProductName = product?.name;
      //добавляем к дате 1 день 
      const adjustedEndDate = new Date(endDate!);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      return this.dataService.getMeasuresPage(productId!, startDate!,
        adjustedEndDate, page.pageIndex, page.pageSize);
    }),
    tap(res => this.total = res.total),
    map(measures =>
        (measures.items ?? []).map(m => ({
          ...m,
          ...Object.fromEntries(
            m.elementValues.map(ev => [ev.elementName, ev.value])
          )
        }))
      )
  );

  //для графиков
  measures$ = combineLatest([
    this.selectedProductSubject,
    this.products$,
    this.pickerStartDate$,
    this.pickerEndDate$,
    this.refresh$
  ]).pipe(
    filter(([productId, , pickerStartDate, pickerEndDate]) =>
      productId != null && pickerStartDate != null && pickerEndDate != null
    ),
    switchMap(([productId, products, startDate, endDate]) => {
      const product = products.find(p => p.id === productId);
      this.fillColumns(product);
      this.selectedProductName = product?.name;
      //добавляем к дате 1 день 
      const adjustedEndDate = new Date(endDate!);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      return this.dataService.getMeasures(productId!, startDate!, adjustedEndDate);
    }),
    map(res => res ?? [])
  );
  
  
  //Шаблон колонок таблицы
  allColumns: DisplayColumn[] = [
    { def: 'time', label: 'Время', hide: false },
    { def: 'el0', label: 'el0', hide: true },
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
  @ViewChild('el0Chart') el0Chart!: ChartComponent;
  @ViewChild('el1Chart') el1Chart!: ChartComponent;
  @ViewChild('el2Chart') el2Chart!: ChartComponent;
  @ViewChild('el3Chart') el3Chart!: ChartComponent;
  @ViewChild('el4Chart') el4Chart!: ChartComponent;
  @ViewChild('el5Chart') el5Chart!: ChartComponent;
  @ViewChild('el6Chart') el6Chart!: ChartComponent;
  @ViewChild('el7Chart') el7Chart!: ChartComponent;
  @ViewChild('el8Chart') el8Chart!: ChartComponent;

  //string array of columns name
  displayedColumns?: string[];
  
  constructor(public dataService: DataService, public navService: NavMenuService) {
   //регистрация иконки
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral('refresh', sanitizer.bypassSecurityTrustHtml(REFRESH_ICON));
    iconRegistry.addSvgIconLiteral('csv', sanitizer.bypassSecurityTrustHtml(DOWNLOAD_CSV_ICON));
    
    this.selectedEnterpriseSubject.subscribe(() => {
      // каждый раз при выборе нового предприятия — сбрасываем продукт 
      this.selectedProductSubject.next(null);
      this.selectedProductName = undefined;
    });
    
    this.measures$.subscribe(mes =>
    {
      this.updateCharts(mes);
    });

    // Подписываемся на роль и список предприятий
    combineLatest([this.isAdmin$, this.enterprises$]).subscribe(
      ([isAdmin, enterprises]) => {
        if (!isAdmin && enterprises.length === 1 && !this.selectedEnterpriseSubject.value) {
          this.selectedEnterpriseSubject.next(enterprises[0].id);
        }
      }
    );
    
  }

  ngOnInit()
  {
  }

  //заполнение графиков
  fillCharts(measures: Measure[]) {
    const time = measures.map(m => m.time);
    
    const elementMap: Record<string, { x: Date; y: number }[]> = {};

    measures.forEach(m => {
      m.elementValues.forEach(ev => {
        if (!elementMap[ev.elementName]) {
          elementMap[ev.elementName] = [];
        }
        elementMap[ev.elementName].push({
          x: new Date(m.time),
          y: ev.value
        });
      });
    });

    return {
      elementSeries: elementMap
    };
  }
  
  //заполнение колонок
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
    
    for (let i = 0; i < 9; i++) {
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
        tap(res =>
          alert(res?.message ?? 'Не получено ответа от сервера'))
      )
      .subscribe({
        error: () => alert('Ошибка при обновлении базы')
      });
    this.refresh$.next();
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
  
  updateCharts(measures: Measure[]) {
    
    //Заполняем данные
    const { elementSeries } = this.fillCharts(measures);
    
    // Объекты графиков и соответствующие элементы
    const chartProps = [
      { chart: this.chart0options, seriesLabelIndex: 1, chartRef: this.el0Chart },
      { chart: this.chart1options, seriesLabelIndex: 2, chartRef: this.el1Chart },
      { chart: this.chart2options, seriesLabelIndex: 3, chartRef: this.el2Chart },
      { chart: this.chart3options, seriesLabelIndex: 4, chartRef: this.el3Chart },
      { chart: this.chart4options, seriesLabelIndex: 5, chartRef: this.el4Chart },
      { chart: this.chart5options, seriesLabelIndex: 6, chartRef: this.el5Chart },
      { chart: this.chart6options, seriesLabelIndex: 7, chartRef: this.el6Chart },
      { chart: this.chart7options, seriesLabelIndex: 8, chartRef: this.el7Chart },
      { chart: this.chart8options, seriesLabelIndex: 9, chartRef: this.el8Chart }
    ];

    // Обновление всех графиков в цикле
    chartProps.forEach(({ chart, seriesLabelIndex, chartRef }) => {
      const label = this.allColumns[seriesLabelIndex].label;

      chart.title = { text: label + ' %' };
      chart.series = [
        {
          name: label,
          data: (elementSeries[label] ?? []).map(p => ({ x: new Date(p.x), y: p.y ?? 0 }))
        }
      ];

      // Обновляем ApexCharts через ссылку на компонент
      if (chartRef) {
        chartRef.updateSeries(chart.series, true);
      }
    });
  }

  // Show-Hide для колонок
  hideColumns() {
    this.displayedColumns = this.allColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }

  //обработчик кнопки скачивания csv 
  downloadCsv(): void {
    const productId = this.selectedProductSubject.value;
    const startDate = this.pickerStartDate$.value;
    const endDate = this.pickerEndDate$.value;
    if (productId !== null && startDate !== null && endDate !== null) {
      //добавляем к дате 1 день 
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      this.dataService.getCsvFile(productId, startDate, adjustedEndDate).subscribe({
        next: (blob) => this.saveFile(blob, 'data.csv'),
        error: (err) => console.error('Ошибка скачивания CSV', err)
      });
    }
    else {
      console.error('Ошибка скачивания CSV');
    }
    
  }

  private saveFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  //Опции графиков по умолчанию
  public chart0options: Partial<ChartOptions> = {
    title: {
      text: this.allColumns[1].label + " %",
    },
    series: [
      {
        name: this.allColumns[1].label,
        //data: this.TFccDps
        data: []
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
      type: "line",
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
        //data: this.el1Dps
        data: []
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
      type: "line",
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
        //data: this.el2Dps
        data: []
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
      type: "line",
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
        //data: this.el3Dps
        data: []
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
      type: "line",
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
        //data: this.el4Dps
        data: []
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
      type: "line",
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
        //data: this.el5Dps
        data: []
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
      type: "line",
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
        //data: this.el6Dps
        data: []
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
      type: "line",
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
        //data: this.el7Dps
        data: []
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
      type: "line",
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
        //data: this.el8Dps
          data: []
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
      type: "line",
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
  //Общие обции для графиков по умолчанию
  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false
    },

    stroke: {
      colors: ["Grey"],
      curve: 'smooth'
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
