import {Component, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'slider-example',
  templateUrl: 'slider_example.html',
  styleUrls: ['slider_example.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SliderConfigurableExample {
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 10;
  vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;
}