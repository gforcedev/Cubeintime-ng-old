import { Component, OnInit } from '@angular/core';
declare let scramblers: any;

@Component({
  selector: 'app-scrambler',
  templateUrl: './scrambler.component.html',
  styleUrls: ['./scrambler.component.css']
})
export class ScramblerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public currentScramble = "";

  public rescramble(e) {
    this.currentScramble = scramblers['333'].getRandomScramble();
  }
}
