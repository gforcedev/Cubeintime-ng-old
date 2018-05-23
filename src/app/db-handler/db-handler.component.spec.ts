import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbHandlerComponent } from './db-handler.component';

describe('DbHandlerComponent', () => {
  let component: DbHandlerComponent;
  let fixture: ComponentFixture<DbHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
