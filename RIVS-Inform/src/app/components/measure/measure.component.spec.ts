import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMultipleHeader } from './measure.component';

describe('MeasureComponent', () => {
  let component: TableMultipleHeader;
  let fixture: ComponentFixture<TableMultipleHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableMultipleHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMultipleHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
