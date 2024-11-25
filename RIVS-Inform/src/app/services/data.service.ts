import { inject, Injectable } from "@angular/core";
import { Measure } from '../models/measure';
import { ProductElements } from '../models/productElements';
import { Enterprise } from '../models/enterprise';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, firstValueFrom, map, Observable, of, tap } from "rxjs";
import { formatDate } from '@angular/common';
import { Data } from "@angular/router";

export interface FirstResp {
  enterpeises: Enterprise[],
  products: ProductElements[],
  lastDate: string[]
}

export interface SynchroResult {
  dateFrom: Date,
  newMeasuresCount: number,
  addRowsCount: number
}

@Injectable({ providedIn: 'root' })
export class TableService {

  httpClient = inject(HttpClient);
  baseUrl = 'http://192.168.15.245:8081/api';
  getMeasuresFlag = false;
  

  productElements?: ProductElements[];
  measures?: Measure[];

  //Запрос данных для заполнения интерфейса
  getAllData(userLogin: string): Observable<FirstResp> {
    return this.httpClient.post<FirstResp>(`${this.baseUrl}/allData`, { userLogin: `${userLogin}` });
  }

  //Запрос измерений
  getMeasures(enterpriseName: string, prodName: string, startDate?: Date, endDate?: Date) {
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
    return this.httpClient.post<Measure[]>(`${this.baseUrl}/meas`,
      {
        enterpriseName: `${enterpriseName}`,
        prodName: `${prodName}`,
        startDate: `${bodyStartDate}`,
        endDate: `${bodyEndDate}`
      });
  };

  //получение списка продуктов принадлежащих предприятию
  getProducts(enterpriseName: string) {
    return this.httpClient.post<ProductElements[]>(`${this.baseUrl}/products`, { enterpriseName: `${enterpriseName}`});
  };

  //запрос синхронизации измерений между SQLSERVER и MariaDb
  updateDb(fromDate: Date) {
    let bodyDate;
    if (fromDate == undefined) {
      bodyDate = ''
    }
    else {
      bodyDate = formatDate(fromDate, 'yyyy-dd-MM', 'en-US');
    }
    return this.httpClient.post<SynchroResult>(`${this.baseUrl}/updateDb`, { dateFrom: `${bodyDate}` });
  }

  //выборка элементов в переданном продукте
  productElementsSelector(prodName: string): string[] {
    [prodName];
    let prodElems = this.productElements!.find(prod => prod.name === prodName)
    var result = [];
    for (var key in prodElems) {
      if (key == 'name') {
        continue;
      }
      result.push(prodElems[key as keyof ProductElements]);

    }
    return result as string[];
  }


  //выбор имён из набора продуктов
  productNameSelector(): string[] {
    return this.productElements!.map(pe => pe.name)
  }

}
