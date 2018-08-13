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
    console.log('afterviewinit');
    this.rescramble({}); //show first scramble
  }
  
  public currentScramble = "";

  
  
  public rescramble(e) {
    this.currentScramble = GLOBALPUZZLES['333'].generateScramble();
    // this.currentScramble = scrambleTest.puzzlesLoaded();
  }
}

//TODO: move the first rescrambling to after the js is executed (ngafterinit?)