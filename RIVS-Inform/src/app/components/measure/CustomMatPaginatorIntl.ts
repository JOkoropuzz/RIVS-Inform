import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Элементов на странице'; 
    this.nextPageLabel = 'Следующая страница';
    this.previousPageLabel = 'Предыдущая страница';
    this.firstPageLabel = 'Первая страница';
    this.lastPageLabel = 'Последняя страница';
  }
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} из ${length}`;
  };
}
