import { trigger, state, transition, animate, style } from '@angular/animations';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

/**
 * Generated class for the ToggleComponent component.
 * This is a component to toggle between two options that are given as inputs
 */

@Component({
  selector: 'toggle',
  templateUrl: 'toggle.html',
  animations: [
    trigger('move', [
      state('right', style({transform: 'translateX(97%)', right: '2px'})),
      state('left', style({transform: 'translateX(0%)', left: '2px'})),
      transition('right => left', [
        animate('200ms ease-in-out', style({left: '2px', transform: 'translateX(0%)'}))
      ]),
      transition('left => right', [
        animate('200ms ease-in-out', style({right: '2px', transform: 'translateX(97%)'}))
      ])
    ])
  ]
})
export class ToggleComponent {
  @Input('firstOption') firstOption;
  @Input('secondOption') secondOption;
  @Input ('selectFirst') selectFirst;
  @Output() selected = new EventEmitter();

  private optionSelected: string = "";
  public currentState: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    console.log('Hello ToggleComponent Component');
  }

  // This function will be to initialize whether the toggle should start on the left or right
  ngAfterViewInit() {
    if(this.selectFirst === "true") {
      this.optionSelected = this.firstOption;
      this.currentState = 'left';
    } else {
      this.optionSelected = this.secondOption;
      this.currentState = 'right';
    } 
    this.cdr.detectChanges(); // This is to prevent error of changes after the view has been initialized
  }

  public selectOption(option) {
    console.log("trying to select option" + option + this.optionSelected);
    if(this.optionSelected === this.firstOption && option === this.secondOption){
      console.log("changing to right");
      this.optionSelected = option;
      this.selected.emit(option);
      this.currentState = 'right';
    } else if(this.optionSelected === this.secondOption && option === this.firstOption){
      console.log("changing to left");
      this.optionSelected = option;
      this.selected.emit(option);
      this.currentState = 'left';
    }
  }
}
