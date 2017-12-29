import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationListComponent } from './prestation-list.component';

describe('PrestationListComponent', () => {
  let component: PrestationListComponent;
  let fixture: ComponentFixture<PrestationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
