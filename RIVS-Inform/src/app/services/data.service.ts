import { inject, Injectable } from "@angular/core";
import { Measure } from '../models/measure';
import { ProductElements } from '../models/productElements';
import { Enterprise } from '../models/enterprise';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { formatDate } from '@angular/common';
import { PagedResponse } from "../models/PagedResponse";
import { SynchronizationResult } from "../models/SynchronizationResult";

@Injectable({ providedIn: 'root' })
export class DataService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:6070/api';

  //список предприятий
  getEnterprises(): Observable<Enterprise[]> {
   
    return this.httpClient.get<Enterprise[]>(`${this.baseUrl}/enterprises`)
  }

  //продукты по предприятию
  getProducts(enterpriseId: number): Observable<ProductElements[]> {
    return this.httpClient.get<ProductElements[]>(`${this.baseUrl}/products`,
      { params: { enterpriseId: `${enterpriseId}` } })
  }

  //Дата последнего измерения для предприятия
  //getLastDate(enterpriseId: number): Observable<Date | null> {
  //  return this.httpClient.get<{ lastDate: Date }>(`${this.baseUrl}/newmeas/lastMeasureDate`,
  //    { params: { enterpriseId: `${enterpriseId}` } })
  //    .pipe(map(res => res?.lastDate));
  //}
  
  //Запрос всех измерений (для графиков)
  getMeasures(prodId: number, startDate: Date, endDate: Date): Observable<Measure[]>{
    let bodyStartDate;
    let bodyEndDate;

    bodyStartDate = formatDate(startDate, 'yyyy-dd-MM', 'en-US');
    bodyEndDate = formatDate(endDate, 'yyyy-dd-MM', 'en-US');
    
    return this.httpClient.get<Measure[]>(`${this.baseUrl}/meas`, {
      params: {
        prodId: `${prodId}`,
        startDate: `${bodyStartDate}`,
        endDate: `${bodyEndDate}`
      }
    });
  };

  getMeasuresPage(
    prodId: number,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number
  ): Observable<PagedResponse<Measure>> {
    return this.httpClient.get<PagedResponse<Measure>>(
      `${this.baseUrl}/meas/paged`,
      {
        params: {
          prodId: String(prodId),
          startDate: formatDate(startDate, 'yyyy-dd-MM', 'en-US'),
          endDate: formatDate(endDate, 'yyyy-dd-MM', 'en-US'),
          page: String(page),
          size: String(size)
        }
      }
    );
  }

  //Запрос данных в csv
  getCsvFile(prodId: number, startDate: Date, endDate: Date): Observable<HttpResponse<Blob>> {
    let bodyStartDate;
    let bodyEndDate;

    bodyStartDate = formatDate(startDate, 'yyyy-dd-MM', 'en-US');
    bodyEndDate = formatDate(endDate, 'yyyy-dd-MM', 'en-US');

    return this.httpClient.get(`${this.baseUrl}/export/csv`, {
      params: {
        prodId: `${prodId}`,
        startDate: `${bodyStartDate}`,
        endDate: `${bodyEndDate}`
      },
      responseType: 'blob',
      observe: 'response'
    });
  }

  //запрос синхронизации измерений
  updateDb(): Observable<SynchronizationResult | null> {
    return this.httpClient.get<SynchronizationResult>(`${this.baseUrl}/synchronization/update-db`);
  }
  
}
