import { Component, ViewChild } from '@angular/core';
import { StatsWindowComponent } from './stats-window/stats-window.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  @ViewChild(StatsWindowComponent)
  private statsWindow: StatsWindowComponent;
  
  public scrambleTypeChangedEvent: any;

  childEventScrambleTypeChanged(event: any) {
    this.scrambleTypeChangedEvent = event;
    this.statsWindow.dbHandler.currentPuzzle = event.puzzle;
    this.statsWindow.dbHandler.refreshForDifferentPuzzle();
  }
}
