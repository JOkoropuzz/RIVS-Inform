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
}
