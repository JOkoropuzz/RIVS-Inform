import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { DataService } from '../../services/data.service';
import { Measure } from '../../models/measure';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NavMenuService } from '../../services/nav-menu.service';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, switchMap, of, combineLatest, map, filter, tap, } from 'rxjs';


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

//TODO: Разбить на отдельные компоненты
export class TableMultipleHeader implements OnInit
{
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
  
  measures$ = combineLatest([
    this.selectedProductSubject,
    this.products$,
    this.pickerStartDate$,
    this.pickerEndDate$
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

  measuresMapped$ = this.measures$.pipe(
    map(measures =>
      (measures ?? []).map(m => ({
        ...m,
        ...Object.fromEntries(
          m.elementValues.map(ev => [ev.elementName, ev.value])
        )
      }))
    )
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
    
    this.selectedEnterpriseSubject.subscribe(() => {
      // каждый раз при выборе нового предприятия — сбрасываем продукт 
      this.selectedProductSubject.next(null);
      this.selectedProductName = undefined;
    });
    
    this.measures$.subscribe(mes =>
    {
      this.updateCharts(mes);
    });
    
    
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
  //Общие обции для графиков по умолчанию
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
