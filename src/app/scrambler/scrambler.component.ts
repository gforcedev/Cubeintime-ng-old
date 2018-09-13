import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare let GLOBALPUZZLES: any;

@Component({
  selector: 'app-scrambler',
  templateUrl: './scrambler.component.html',
  styleUrls: ['./scrambler.component.css']
})
export class ScramblerComponent implements OnInit, AfterViewChecked {

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewChecked() {
    if (!this.firstScrambleDone) {
      this.rescramble('333'); //show first scramble
      this.firstScrambleDone = true;
    }
  }
  
  public currentScramble = 'scrambling...';
  private firstScrambleDone = false;
  
  
  public rescramble(puzzle) {
    this.currentScramble = 'scrambling...';
    this.currentScramble = GLOBALPUZZLES[puzzle].generateScramble();
  }
}
