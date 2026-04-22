import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enterprise } from '../../models/enterprise';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-measure-by-repers.component',
  templateUrl: './measure-by-repers.component.html',
  styleUrls: ['./measure-by-repers.component.scss'],
})
export class MeasureByRepersComponent implements OnInit {
  authService = inject(AuthService);
  isAdmin$ = this.authService.isAdmin$; // Observable<boolean>

  filterForm!: FormGroup;

  /** Список предприятий */
  enterprises: Enterprise[] = [
    { id: 1, name: 'ОАО "Северсталь"'},
    { id: 2, name: 'ПАО "Газпром"'},
    { id: 3, name: 'АО "Норникель"'},
  ];

  /** Доступные часы 00–23 */
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  /** Результат формы для отображения */
  submittedData: { enterprise: Enterprise; date: Date; hour: number } | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      enterprise: [null, Validators.required],
      date: [null, Validators.required],
      hour: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      const { enterprise, date, hour } = this.filterForm.value;
      this.submittedData = { enterprise, date, hour };
    } else {
      this.filterForm.markAllAsTouched();
    }
  }

  /** Форматирование часа в строку HH:00 */
  formatHour(h: number): string {
    return h.toString().padStart(2, '0') + ':00';
  }
  
}
