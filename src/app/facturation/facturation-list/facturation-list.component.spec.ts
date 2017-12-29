import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationListComponent } from './facturation-list.component';

describe('FacturationListComponent', () => {
  let component: FacturationListComponent;
  let fixture: ComponentFixture<FacturationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
