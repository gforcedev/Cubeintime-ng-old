import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScramblerComponent } from './scrambler.component';

describe('ScramblerComponent', () => {
  let component: ScramblerComponent;
  let fixture: ComponentFixture<ScramblerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScramblerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScramblerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
