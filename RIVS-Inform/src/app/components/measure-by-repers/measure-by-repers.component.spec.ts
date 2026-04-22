import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureByRepersComponent } from './measure-by-repers.component';

describe('MeasureByRepersComponent', () => {
  let component: MeasureByRepersComponent;
  let fixture: ComponentFixture<MeasureByRepersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeasureByRepersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureByRepersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
