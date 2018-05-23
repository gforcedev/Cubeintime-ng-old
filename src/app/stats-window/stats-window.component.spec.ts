import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWindowComponent } from './stats-window.component';

describe('StatsWindowComponent', () => {
  let component: StatsWindowComponent;
  let fixture: ComponentFixture<StatsWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
