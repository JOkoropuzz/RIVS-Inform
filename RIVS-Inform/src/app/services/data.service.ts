import { inject, Injectable } from "@angular/core";
import { Measure } from '../models/measure';
import { ProductElements } from '../models/productElements';
import { Enterprise } from '../models/enterprise';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, firstValueFrom, map, Observable, of, tap } from "rxjs";
import { formatDate } from '@angular/common';

//export interface FirstResp {
//  enterpeises: Enterprise[],
//  products: ProductElements[],
//  lastDate: string[]
//}

export interface SynchronizationResult {
  dateFrom: Date,
  message: string,
  //newMeasuresCount: number
}

@Injectable({ providedIn: 'root' })
export class DataService {

  /*private enterprises: Enterprise[] | null = null;*/
  /*private readonly enterprisesCacheKey = 'enterprises-cache'; */

  //private products: ProductElements[] | null = null;
  //private readonly productsCacheKey = 'products-cache';

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:6070/api';
  getMeasuresFlag = false;
  

  //productElements?: ProductElements[];
  /*measures?: Measure[];*/

  //Запрос данных для заполнения интерфейса
  //getAllData(userLogin: string): Observable<FirstResp> {
  //  return this.httpClient.post<FirstResp>(`${this.baseUrl}/allData`, { userLogin: `${userLogin}` });
  //}

  getEnterprises(): Observable<Enterprise[]> {
    //if (this.enterprises) {
    //  return of(this.enterprises);
    //}
    
    //const cached = localStorage.getItem(this.enterprisesCacheKey);
    //if (cached) {
    //  try {
    //    const parsed = JSON.parse(cached);
    //    this.enterprises = Array.isArray(parsed) ? parsed as Enterprise[] : [];
    //    return of(this.enterprises);
    //  } catch {
    //    this.enterprises = [];
    //  }
    //}
    
    return this.httpClient.get<Enterprise[]>(`${this.baseUrl}/newenterprise/all`)//.pipe(
      //tap(data => {
        /*this.enterprises = data;*/
        //localStorage.setItem(this.enterprisesCacheKey, JSON.stringify(data));
      //})
    //);
  }

  getProducts(enterpriseId: number): Observable<ProductElements[]> {
    //if (!this.products) {
    //  const cached = localStorage.getItem(this.productsCacheKey);
    //  if (cached) {
    //    try {
    //      const parsed = JSON.parse(cached);
    //      this.products = Array.isArray(parsed) ? parsed as ProductElements[] : [];
    //    }
    //    catch {
    //      this.clearCache();
    //    }
    //  }
    //  else {
    return this.httpClient.get<ProductElements[]>(`${this.baseUrl}/newproduct/allByEnterprise`,
      { params: { enterpriseId: `${enterpriseId}` } })//.pipe(
          //tap(data => {
          //  this.products = data;
          //  localStorage.setItem(this.productsCacheKey, JSON.stringify(data));
          //})
        //);
    //  }
    //}
    /*return of(this.products?.filter(product => product.enterpriseId === enterpriseId) ?? []);*/
  }
  
  getLastDate(enterpriseId: number): Observable<Date> {
    return this.httpClient.get<{ lastDate: Date }>(`${this.baseUrl}/lastMeasureDate`,
      { params: { enterpriseId: `${enterpriseId}` } })
      .pipe(map(res => res.lastDate));
  }

  //clearCache() {
  //  this.enterprises = null;
  //  localStorage.removeItem(this.enterprisesCacheKey);

  //  this.products = null;
  //  localStorage.removeItem(this.productsCacheKey);
  //}

  //Запрос измерений
  getMeasures(prodId: number, startDate?: Date, endDate?: Date): Observable<Measure[]>{
    let bodyStartDate;
    let bodyEndDate;
    //если дата не определена, то передаётся пустая строка
    //обработка запроса без даты происходит в хранимой процедуре на стороне БД
    if (startDate == undefined) {
      bodyStartDate = ''
    }
    else {
      bodyStartDate = formatDate(startDate, 'yyyy-dd-MM', 'en-US');
    }
    if (endDate == undefined) {
      bodyEndDate = ''
    }
    else {
      bodyEndDate = formatDate(endDate, 'yyyy-dd-MM', 'en-US');
    }
    return this.httpClient.get<Measure[]>(`${this.baseUrl}/meas`, {
      params: {
        prodId: `${prodId}`,
        startDate: `${bodyStartDate}`,
        endDate: `${bodyEndDate}`
      }
    });
  };

  //получение списка продуктов принадлежащих предприятию
  //getProducts(enterpriseName: string) {
  //  return this.httpClient.post<ProductElements[]>(`${this.baseUrl}/products`, { enterpriseName: `${enterpriseName}`});
  //};

  //запрос синхронизации измерений между SQLSERVER и MariaDb
  updateDb() {
    //let bodyDate;
    //if (fromDate == undefined || fromDate == '') {
    //  bodyDate = formatDate(0, 'yyyy-dd-MM', 'en-US')
    //}
    //else {
    //  bodyDate = formatDate(fromDate, 'yyyy-dd-MM', 'en-US');
    //}
    //return this.httpClient.post<SynchroResult>(`${this.baseUrl}/updateDb`, { dateFrom: `${bodyDate}` });
    return this.httpClient.get<SynchronizationResult>(`${this.baseUrl}/updateDb`);
  }

  //выборка элементов в переданном продукте
  //productElementsSelector(prodName: string): string[] {
  //  [prodName];
  //  let prodElems: ProductElements | undefined;
  //  this.getProducts().subscribe(products => {
  //    prodElems = products.find(prod => prod.name === prodName);
  //  });
  //  if (prodElems == undefined) {
  //    return [];
  //  }
  //  var result = [];
  //  for (var key in prodElems) {
  //    if (key.includes('el')) {
  //      result.push(prodElems[key as keyof ProductElements]);
  //    }
  //  }
  //  return result as string[];
  //}
  
  //выбор имён из набора продуктов
  //productNameSelector(): string[] {
  //  let result: string[] = [];
  //  this.getProducts().subscribe(products => {
  //    result = products.map(pe => pe.name);
  //  });
  //  return result;
  //}

}
