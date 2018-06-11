import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';

export interface Time { time: number,
  timeStr: string,
  type: string,
  subtype: string,
  scramble: string,
  penalty: number,
  created: number,
  uuid: string;
  }

@Component({
  selector: 'app-db-handler',
  templateUrl: './db-handler.component.html',
  styleUrls: ['./db-handler.component.css']
})
export class DbHandlerComponent implements OnInit {

  private timesCollection: AngularFirestoreCollection<Time>;
  public times: Observable<Time[]>;
  public viewingTime: Time;
  public penaltyStrings = ['No Penalty', '+2', 'DNF'];
  public penaltyStyles = ['', '', 'text-decoration: line-through'];
  public necessaryAverages : Number[] = [5, 12, 50];
  public averages = [];
  public currentlyViewing: String;
  public mostRecentTime: Time;
  public dontUpdateViewingTime: Boolean;
  public blankViewingTime: Time = {
    time : 0,
    timeStr: '',
    type: '',
    subtype: '',
    scramble: '',
    penalty: 0,
    created: Date.now(),
    uuid: ''
  };
  
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private sanitizer: DomSanitizer) {
    this.setViewingTime(this.blankViewingTime);
    this.dontUpdateViewingTime = false;
    
    afAuth.authState.subscribe(res => {
      if(res) {
        this.timesCollection = afs.collection<Time>('users/' + res.uid + '/times', ref => ref.orderBy('created', 'desc'));
        this.times = this.timesCollection.valueChanges();
        this.times.subscribe(e => {
          this.mostRecentTime = e[0];
          if (!this.dontUpdateViewingTime) {
            this.setViewingTime(this.mostRecentTime || this.blankViewingTime);
          } else {
            this.dontUpdateViewingTime = false;
          }
          this.averages = this.genAverages(e);
        });
      }
    });
  }
  
  ngOnInit() {
  }
  
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  generateTimeString(t) {
    var s = t.toString() + '000';
    return s.substring(0, s.indexOf('.') + 3);
  }
  
  addTime(e) {
    //VERY small chance that this part overwrites a previously existing time...
    var uuid = this.uuidv4();
    e.uuid = uuid;
    this.setViewingTime(e);
    this.timesCollection.doc(uuid).set(e);
  }
  
  deleteViewingTime() {
    this.timesCollection.doc(this.viewingTime.uuid).delete();
    this.setViewingTime(this.mostRecentTime || this.blankViewingTime);
  }
  
  
  setViewingTime(e) {
    this.viewingTime = e;
    this.currentlyViewing = e.uuid;
  }
  
  getPenaltyButtonColor(x) {
    if (this.viewingTime != this.blankViewingTime) {
      if (this.viewingTime.penalty == x) {
        return 'primary';
      }
      return '';
    }
  }
  
  getCardPenaltyStyle(e) {
    return this.sanitizer.bypassSecurityTrustStyle(this.penaltyStyles[e.penalty]);
  }
  
  setPenalty(x) {
    if (this.mostRecentTime != null) {
      this.dontUpdateViewingTime = true; //set the flag to not change viewing time
      var e = {penalty: x, timeStr: this.viewingTime.timeStr.toString()};
      if (this.viewingTime.penalty == 1 && x != 1) { //it used to be a +2 and isnt now
        e.timeStr = this.generateTimeString(parseFloat(this.viewingTime.timeStr.substr(0, this.viewingTime.timeStr.indexOf('+'))) - 2.00);
      } else if (x == 1 && this.viewingTime.penalty != 1) { //it wasnt a +2 and now it is
        e.timeStr = this.generateTimeString(parseFloat(this.viewingTime.timeStr) + 2.00)+ '+';
      }
      this.timesCollection.doc(this.viewingTime.uuid).update(e);
      this.viewingTime.penalty = x;
      this.viewingTime.timeStr = e.timeStr;
    }
  }

  genAverages(e) {
    var toReturn = [];
    for (let a of this.necessaryAverages) {
      if (e.length < a) {
        toReturn.push('Needs more times to calculate');
        break;
      }
      var dnfs = [];
      var myNums = [];
      for (var i = 0; i < +a; i++) {
        myNums.push(parseFloat(e[i].timeStr));
        if (e[i].penalty == 2) {
          dnfs.push(e[i]);
        }
      }
      
      var sum = 0;
      for (let t of myNums) {
        sum += t;
      }
      
      if (dnfs.length > 1) {
        toReturn.push("DNF");
      } else if (dnfs.length == 1) {
        sum -= parseFloat(dnfs[0].timeStr);
        sum -= Math.min(...myNums);
        toReturn.push(this.generateTimeString((sum / (+a - 2))));
      } else {
        sum -= Math.max(...myNums);
        sum -= Math.min(...myNums);
        toReturn.push(this.generateTimeString((sum / (+a - 2))));
      }
    }
    return toReturn;
  }
}