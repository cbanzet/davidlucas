import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationEventComponent } from './facturation-event.component';

describe('FacturationEventComponent', () => {
  let component: FacturationEventComponent;
  let fixture: ComponentFixture<FacturationEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
