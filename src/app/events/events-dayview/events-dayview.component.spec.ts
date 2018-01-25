import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDayviewComponent } from './events-dayview.component';

describe('EventsDayviewComponent', () => {
  let component: EventsDayviewComponent;
  let fixture: ComponentFixture<EventsDayviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsDayviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsDayviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
