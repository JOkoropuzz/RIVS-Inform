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
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:6070/api';
  getMeasuresFlag = false;

  //список предприятий
  getEnterprises(): Observable<Enterprise[]> {
   
    return this.httpClient.get<Enterprise[]>(`${this.baseUrl}/newenterprise/all`)
  }

  //продукты по предприятию
  getProducts(enterpriseId: number): Observable<ProductElements[]> {
    return this.httpClient.get<ProductElements[]>(`${this.baseUrl}/newproduct/allByEnterprise`,
      { params: { enterpriseId: `${enterpriseId}` } })
  }

  //Дата последнего измерения для предприятия
  getLastDate(enterpriseId: number): Observable<Date | null> {
    return this.httpClient.get<{ lastDate: Date }>(`${this.baseUrl}/newmeas/lastMeasureDate`,
      { params: { enterpriseId: `${enterpriseId}` } })
      .pipe(map(res => res?.lastDate));
  }
  
  //Запрос измерений
  getMeasures(prodId: number, startDate?: Date | null, endDate?: Date | null): Observable<Measure[]>{
    let bodyStartDate;
    let bodyEndDate;
    //если дата не определена, то передаётся пустая строка
    //обработка запроса без даты происходит в хранимой процедуре на стороне БД
    if (!startDate) {
      bodyStartDate = ''
    }
    else {
      bodyStartDate = formatDate(startDate, 'yyyy-dd-MM', 'en-US');
    }
    if (!endDate) {
      bodyEndDate = ''
    }
    else {
      bodyEndDate = formatDate(endDate, 'yyyy-dd-MM', 'en-US');
    }
    return this.httpClient.get<Measure[]>(`${this.baseUrl}/newmeas/allByProductId`, {
      params: {
        prodId: `${prodId}`,
        startDate: `${bodyStartDate}`,
        endDate: `${bodyEndDate}`
      }
    });
  };
  
  //запрос синхронизации измерений
  updateDb(): Observable<SynchronizationResult | null> {
    return this.httpClient.get<{ synchronizationResult: SynchronizationResult }>(`${this.baseUrl}/newupdatedb/upd`)
      .pipe(map(res => res?.synchronizationResult));
  }
  
}
