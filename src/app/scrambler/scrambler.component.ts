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
      this.rescramble({}); //show first scramble
      this.firstScrambleDone = true;
    }
  }
  
  public currentScramble = "";
  private firstScrambleDone = false;
  
  
  public rescramble(e) {
    this.currentScramble = GLOBALPUZZLES['333'].generateScramble();
    // this.currentScramble = scrambleTest.puzzlesLoaded();
  }
}
