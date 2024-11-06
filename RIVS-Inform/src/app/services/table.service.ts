import { inject, Injectable } from "@angular/core";
import { Measure } from '../models/measure';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, firstValueFrom, map, Observable, of, tap } from "rxjs";
export interface ProductElements {
  name: string;
  el1?: string;
  el2?: string;
  el3?: string;
  el4?: string;
  el5?: string;
  el6?: string;
  el7?: string;
  el8?: string;
}

export interface Enterprise {
  name: string;
}



@Injectable({ providedIn: 'root' })
export class TableService {

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8081/api';
  getMeasuresFlag = false;
  //enterprises: string[] = ['ООО «Новоангарский обогатительный комбинат»', 'АО «Лебединский горно-обогатительный комбинат»'];


  //measures: Measure[] = [
  //  { name: 'c1', time: new Date('2024-09-23 12:09'), TFcc: 21.9, el1: 0.49, el2: 6.93, el3: 20.0, el4: 24.1, el5: 24.1, el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c1', time: new Date('2024-09-23 12:11'), TFcc: 20.9, el1: 1.89, el2: 8.45, el3: 22.3, el4: 24.1, el5: 24.1, el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c1', time: new Date('2024-09-23 12:12'), TFcc: 11.9, el1: 3.87, el2: 7.29, el3: 21.7, el4: 24.1, el5: 24.1, el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c1', time: new Date('2024-09-23 12:13'), TFcc: 20.3, el1: 0.89, el2: 6.65, el3: 24.1, el4: 24.1, el5: 24.1, el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-22 12:18'), TFcc: 24.3, el1: 0.85, el2: 6.85, el3: 23.6, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-22 12:23'), TFcc: 20.5, el1: 0.49, el2: 7.65, el3: 11.1, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-22 12:33'), TFcc: 25.3, el1: 0.85, el2: 8.85, el3: 23.7, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-23 12:18'), TFcc: 24.3, el1: 0.85, el2: 6.85, el3: 23.6, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-23 12:23'), TFcc: 20.5, el1: 0.49, el2: 7.65, el3: 11.1, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-23 12:33'), TFcc: 25.3, el1: 0.85, el2: 8.85, el3: 23.7, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-24 12:18'), TFcc: 24.3, el1: 0.85, el2: 6.85, el3: 23.6, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-24 12:23'), TFcc: 20.5, el1: 0.49, el2: 7.65, el3: 11.1, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c2', time: new Date('2024-09-24 12:33'), TFcc: 25.3, el1: 0.85, el2: 8.85, el3: 23.7, el4: 24.1, el5: 24.1, el6: 24.1, el7: undefined, el8: undefined },
  //  { name: 'c1', time: new Date('2024-09-23 12:43'), TFcc: 26.3, el1: 0.69, el2: 5.75, el3: 22.1, el4: 24.1, el5: 24.1, el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c3', time: new Date('2024-09-23 12:45'), TFcc: 26.3, el1: 0.69, el2: 5.75, el3: 22.1, el4: 24.1, el5: 24.1, el6: 22.3, el7: 22.2, el8: 22.1 },
  //  { name: 'c3', time: new Date('2024-09-23 12:50'), TFcc: 26.3, el1: 0.69, el2: 5.75, el3: 22.1, el4: 24.1, el5: 24.1, el6: 22.3, el7: 22.2, el8: 22.1 },
  //  { name: 'c3', time: new Date('2024-09-23 12:53'), TFcc: 26.3, el1: 0.69, el2: 5.75, el3: 22.1, el4: 24.1, el5: 24.1, el6: 22.3, el7: 22.2, el8: 22.1 },
  //];

  //productElements: ProductElements[] = [
  //  { name: 'c1', el1: 'Cu', el2: 'Fe', el3: 'Zn', el4: 'Pb', el5: 'Mb', el6: undefined, el7: undefined, el8: undefined },
  //  { name: 'c2', el1: 'Ka', el2: 'Mg', el3: 'Zn', el4: 'Pb', el5: 'Mb', el6: 'Fe', el7: undefined, el8: undefined },
  //  { name: 'c3', el1: 'Be', el2: 'Fe', el3: 'Zn', el4: 'Pb', el5: 'Mb', el6: 'Ka', el7: 'Mg', el8: 'Na' },
  //];

  productElements?: ProductElements[];
  measures?: Measure[];

  public productNames?: string[];

  getEnterprisesNames(userLogin: string): Observable<Enterprise[]> {
    console.error('Я обновился 4');
    return this.httpClient.post<Enterprise[]>(`${this.baseUrl}/enterprises`, { userLogin: `${userLogin}` });
  }

  getMeasures(enterpriseName: string) {
    return this.httpClient.post<Measure[]>(`${this.baseUrl}/meas`, { enterpriseName: `${enterpriseName}` });
  };

  getProducts(enterpriseName: string) {
    return this.httpClient.post<ProductElements[]>(`${this.baseUrl}/products`, { enterpriseName: `${enterpriseName}`});
  };

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

  productSelector(prodName: string): Measure[] {
    return this.measures!.filter(
      (measure) => measure.name == prodName);
  }

  productSelectorWithDate(prodName: string, startDate: Date, endDate: Date): Measure[] {
    return this.measures!.filter(
      (measure) => measure.name == prodName && measure.time > startDate && measure.time < this.addDays(endDate, 1));
  }

  addDays(date: Date, days: number): Date {
  let result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
  }

  productNameSelector(): string[] {
    
    const unique = this.measures!.reduce((accumulator: Measure[], current) => {
      if (accumulator.findIndex(obj => obj['name'] === current.name) === -1) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
    this.productNames = unique.map(item => item['name']);
    return this.productNames;
  }

}
