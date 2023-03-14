import { Component, OnInit, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';
@Component({
  selector: 'app-mouse-events',
  templateUrl: './mouse-events.component.html',
  styleUrls: ['./mouse-events.component.css'],
})
export class MouseEventsComponent implements OnInit {
  vector: string;
  mouseup$: any;
  mousedown$: any;
  mousemove$: any;
  mousehold$: any;
  downstatus = false;
  x: number;
  y: number;
  _sub: any;
  constructor(private _el: ElementRef) {}

  ngOnInit() {
    this.mousedown$ = fromEvent(this._el.nativeElement, 'mousedown');
    this.mousedown$.subscribe((e) => {
      if (!this.downstatus) {
        this.x = e.x;
        this.y = e.y;
        this.downstatus = true;
        this.vector = '0,0'; //reset
      }
    });
    this.mousemove$ = fromEvent(this._el.nativeElement, 'mousemove');
    this.mouseup$ = fromEvent(this._el.nativeElement, 'mouseup');

    this.mouseup$.subscribe((e) => {
      this.unsub();
      this.register();
      this.downstatus = false;
    });

    this.register();
  }

  unsub() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  register() {
    this.mousehold$ = this.mousedown$
      // generate mousehold observable from mousemove
      .switchMap(() => this.mousemove$)
      .takeUntil(this.mouseup$);

    this._sub = this.mousehold$.subscribe((e) => {
      //this.x = e.x;
      //this.y = e.y;
      this.vector = e.x - this.x + ',' + (e.y - this.y);
    });
  }
}
