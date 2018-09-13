import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Renderer2, Input } from '@angular/core';
import { ScramblerComponent } from '../scrambler/scrambler.component';
import { DbHandlerComponent } from '../db-handler/db-handler.component'

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],

  host: { //event bindings
    '(document:keyup)': 'onKeyUp($event)',
    '(document:keydown)' : 'onKeyDown($event)'
  }
})
export class StopwatchComponent implements OnInit {

  constructor() {
  }
  
  @Output() eventScrambleTypeChanged = new EventEmitter<any>();

  @ViewChild(ScramblerComponent)
  private scrambleChip: ScramblerComponent;
  
  ngOnInit() {
  }
  
  @ViewChild(DbHandlerComponent)
  public dbHandler: DbHandlerComponent;
  
  time = 0;
  start = 0;
  
  timeString = '0.00';
  timerColors = ['#76FF03', '#000000', '#F44336', '#000000'];
  timeInterval = null;
  timing = 3;
  down = false;

  onKeyDown(e) {
    if (e.key == ' ') {
      switch(this.timing) {
        case 3: {
          if (!this.down) {
            this.down = true;
            this.time = 0;
            this.timeString = '0.00';
            this.timing = 0; //ready
            break;
          }
        }
        case 1: {
          this.down = true;
          clearInterval(this.timeInterval);
          this.timing = 2; //finishing
          break;
        }
      }
    }
  }

  onKeyUp(e) {
    if (e.key == ' ') {
      this.down = false;
      switch (this.timing) {
        case 0: {
			this.start = Date.now();
			this.timeInterval = setInterval(() => {
			this.updateTimer();
			}, 10);
  this.timing = 1; //timing
          break;
        }
        case 2: {
          this.dbHandler.addTime({
            time : this.time,
            timeStr: this.timeString.toString(),
            type: this.dbHandler.currentPuzzle,
            subtype: 'default',
            scramble: this.scrambleChip.currentScramble,
            penalty: 0,
            created: Date.now()
          });
          
          this.scrambleChip.rescramble(this.dbHandler.currentPuzzle);
          this.timing = 3; //done
          break;
        }
      }
    }
    this.down = false;
  }

  updateTimer() {
    this.time += (Date.now() - this.start) / 1000;
    this.timeString = this.dbHandler.generateTimeString(this.time);
    this.start = Date.now();
  }
}
