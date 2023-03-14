import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { skipUntil, takeUntil } from 'rxjs/operators';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular 5';
  mouseX: number;
  mouseY: number;
  sub: any;
  box: any;
  mousedown$;
  mouseup$;
  constructor(public renderer: Renderer2) {

  }
  ngOnInit() {
    this.box = this.renderer.selectRootElement('#box');
    console.log(typeof this.box);
    this.renderer.setStyle(this.box, 'height', '300px');
    this.renderer.setStyle(this.box, 'backgroundColor', 'blue');
    this.renderer.setStyle(this.box, 'display', 'flex');

    // Non-custom attribute has 1:1 map on property. However, 'class' attr is matched to 'className' because 'class' is reserved keyword in Javascript
    this.renderer.setProperty(this.box, 'className', 'box-1'); // property is on DOM
    this.renderer.setAttribute(this.box, 'title', 'title'); // attribute in on HTML
    this.mousedown$ = fromEvent(this.box, 'mousedown');
    this.mouseup$ = fromEvent(this.box, 'mouseup');
    this.mouseup$.subscribe(_ => {
      this.register();
    })
    this.mousedown$.subscribe(_ => {
      console.log('clicked');
    });
    this.register();
  }

  register() {
    try {
      this.sub.unsubscribe();
    } catch (err) {
      
    } finally {

    }

    let mousemove$ = fromEvent(this.box, 'mousemove');
    mousemove$ = mousemove$.pipe(skipUntil(this.mousedown$));
    mousemove$ = mousemove$.pipe(takeUntil(this.mouseup$));
    this.sub = mousemove$.subscribe((e: any) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      console.log(e.x, e.y);
    })
  }
}
