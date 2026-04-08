import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({ selector: '[appChartHost]' })
export class ChartHostDirective implements OnInit {
  @Output() hostReady = new EventEmitter<HTMLElement>();

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    this.hostReady.emit(this.el.nativeElement);
  }
}
