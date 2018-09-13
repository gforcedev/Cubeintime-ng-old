import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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

  // private timesCollections: AngularFirestoreCollection<Time>[];
  private timesCollections = {};
  public timesObservable: Observable<Time[]>;
  public timesSubscription: Subscription;
  public times = [];
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
  public currentPuzzle = '333';
  public puzzleIds = [
    {'id': '222', 'name': '2x2x2 cube'},
    {'id': '333', 'name': '3x3x3 cube'},
    {'id': '444', 'name': '4x4x4 cube'},
    {'id': '555', 'name': '5x5x5 cube'},
    {'id': '666', 'name': '6x6x6 cube'},
    {'id': '777', 'name': '7x7x7 cube'},
    {'id': 'pyram', 'name': 'Pyraminx'},
    {'id': 'sq1', 'name': 'Square-1'},
    {'id': 'minx', 'name': 'Megaminx'},
    {'id': 'clock', 'name': 'Rubik\'s Clock'},
    {'id': 'skewb', 'name': 'Skewb'},
  ]
  
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private sanitizer: DomSanitizer) {
    this.setViewingTime(this.blankViewingTime);
    this.dontUpdateViewingTime = false;
    
    afAuth.authState.subscribe(res => {
      if(res) {
        this.timesCollections = [];
        for (let p of this.puzzleIds) {
          this.timesCollections[p.id] = afs.collection<Time>('users/' + res.uid + '/times', ref => ref.where('type', '==', p.id).orderBy('created', 'desc'));
        }
        this.timesObservable = this.timesCollections[this.currentPuzzle].valueChanges();
        this.timesSubscription = this.timesObservable.subscribe(e => {
          this.times = e;
          this.mostRecentTime = this.times[0];
          if (!this.dontUpdateViewingTime) {
            this.setViewingTime(this.mostRecentTime || this.blankViewingTime);
          } else {
            this.dontUpdateViewingTime = false;
          }
          this.averages = this.genAverages(this.times);
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
    var hourCount = 0;
    while (t > 3600) {
      hourCount++;
      t -= 3600;
    }
    var minCount = 0;
    while (t > 60) {
      minCount++;
      t -= 60;
    }
    
    var s = t.toString() + '000';
    var toReturn = s.substring(0, s.indexOf('.') + 3);
    
    if (minCount != 0) {
      if (t < 10) {
        toReturn = '0' + toReturn;
      }
      toReturn = minCount.toString() + ':' + toReturn;
    }
    if (hourCount != 0) {
      toReturn = hourCount.toString() + ':' + toReturn;
    }
    return toReturn;
  }
  
  addTime(e) {
    //VERY small chance that this part overwrites a previously existing time...
    var uuid = this.uuidv4();
    e.uuid = uuid;
    this.setViewingTime(e);
    this.timesCollections[this.currentPuzzle].doc(uuid).set(e);
  }
  
  deleteViewingTime() {
    this.timesCollections[this.currentPuzzle].doc(this.viewingTime.uuid).delete();
    this.setViewingTime(this.mostRecentTime || this.blankViewingTime);
  }
  
  
  setViewingTime(e) {
    this.viewingTime = e;
    this.currentlyViewing = e.uuid;
  }
  
  refreshForDifferentPuzzle() {
    this.timesObservable = this.timesCollections[this.currentPuzzle].valueChanges();
    this.timesSubscription.unsubscribe();
    this.timesSubscription = null;
    this.timesSubscription = this.timesObservable.subscribe(e => {
      this.times = e;
      this.mostRecentTime = this.times[0];
      if (!this.dontUpdateViewingTime) {
        this.setViewingTime(this.mostRecentTime || this.blankViewingTime);
      } else {
        this.dontUpdateViewingTime = false;
      }
      this.averages = this.genAverages(this.times);
    });
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
      var e = {penalty: x, timeStr: this.viewingTime.timeStr.toString(), time: this.viewingTime.time};
      if (this.viewingTime.penalty == 1 && x != 1) { //it used to be a +2 and isnt now
        e.timeStr = this.generateTimeString(e.time);
      } else if (x == 1 && this.viewingTime.penalty != 1) { //it wasnt a +2 and now it is
        e.timeStr = this.generateTimeString(e.time + 2.00)+ '+';
      }
      this.timesCollections[this.currentPuzzle].doc(this.viewingTime.uuid).update(e);
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