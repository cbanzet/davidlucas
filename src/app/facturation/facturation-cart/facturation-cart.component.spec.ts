import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationCartComponent } from './facturation-cart.component';

describe('FacturationCartComponent', () => {
  let component: FacturationCartComponent;
  let fixture: ComponentFixture<FacturationCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
