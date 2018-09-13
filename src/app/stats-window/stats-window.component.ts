import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { DbHandlerComponent } from '../db-handler/db-handler.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-stats-window',
  templateUrl: './stats-window.component.html',
  styleUrls: ['./stats-window.component.css']
})
export class StatsWindowComponent implements OnInit {

  @ViewChild(DbHandlerComponent)
  public dbHandler : DbHandlerComponent;
  
  @Input() event: Event;

  constructor(public dialog: MatDialog) {}
  
  showDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: { timeStr: this.dbHandler.viewingTime.timeStr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dbHandler.deleteViewingTime();
      }
    });
  }

  ngOnInit() {
  }
}
